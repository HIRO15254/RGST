from datetime import datetime
import pathlib
import re
import string
import cv2
import numpy
import glob
import json_funks
from typing import Final, TypedDict


class areaDict(TypedDict):
    x: int
    y: int
    w: int
    h: int


class histsDict(TypedDict):
    b: numpy.ndarray
    g: numpy.ndarray
    r: numpy.ndarray


def analyse_arcaea_result(settings_path: str, data_path: str, jackets_path: str, nums_path: str, result_path: str, *image_paths: tuple[str]):
    settings: dict = json_funks.get(settings_path)
    data: dict = json_funks.get(data_path)
    areas: dict[areaDict] = settings["arcaea"]["areas"]
    # ジャケットファイルのヒストグラムを読み込む
    jackets_data: dict[str, dict] = dict()
    _jackets_data_path = glob.glob(f"{jackets_path}/*")
    for jacket_data_path in _jackets_data_path:
        jackets_data[jacket_data_path] = numpy.load(jacket_data_path, allow_pickle=True)
    # 判定用数字ファイルを読み込む
    num_imgs: list[list[numpy.ndarray]] = [[] for _ in range(10)]
    for i in range(10):
        num_paths = glob.glob(f"{nums_path}/{i}/*")
        for num_path in num_paths:
            num_imgs[i].append(cv2.imread(num_path, cv2.IMREAD_GRAYSCALE))

    def getarea(image: numpy.ndarray, name: str) -> numpy.ndarray:
        """設定ファイルから位置を取得し、画像を切り抜く

        Args:
            image (numpy.ndarray): 切り抜く元の画像
            name (str): 切り抜く範囲の設定ファイルにおける名前

        Returns:
            numpy.ndarray: 切り抜いた画像
        """
        return image[areas[name]["y"]: areas[name]["y"] + areas[name]["h"], areas[name]["x"]: areas[name]["x"] + areas[name]["w"]]

    def checkJacket(trimmed_image: numpy.ndarray) -> string:
        """ジャケットが何か判定し、その楽曲のタイトルを返す

        Args:
            trimmed_image (numpy.ndarray): ジャケット部分のみを切り抜いた画像

        Returns:
            string: 最も一致度が高かったジャケットの楽曲タイトル
        """
        resized_image: numpy.ndarray = cv2.resize(trimmed_image, (256, 256))
        best_num: int = 0
        best_val: int = 10**18
        for jacket_path, jacket_npy in jackets_data.items():
            im_diff = resized_image.astype(int) - jacket_npy.astype(int)
            ret = numpy.sum(numpy.abs(im_diff))
            if best_val > ret:
                best_num = int(re.search(r"jacket(\d{1,3})[abcdefg]\.npy", jacket_path).group(1))
                best_val = ret
        # 類似度が最も高かったもののタイトルを返す
        return [k["title"] for k in data["songs"] if k["id"] == best_num][0]

    def checknum(trimmed_img: numpy.ndarray) -> int:
        """与えられた画像が数字の何であるかを判定する

        Args:
            trimmed_img (numpy.ndarray): 数字のところのみを切り抜いた画像

        Returns:
            int: 判定された数字
        """
        ans = [0 for _ in range(10)]
        # 各数字セット(10枚ずつ)について類似度を検出
        for i in range(10):
            for num_img in num_imgs[i]:
                # 与えられた画像をリサイズして比較
                resized_img = cv2.resize(trimmed_img, (num_img.shape[1], num_img.shape[0]))
                _, threshed_img = cv2.threshold(resized_img, 128, 255, cv2.THRESH_BINARY)
                ans[i] += numpy.count_nonzero(threshed_img == num_img) / threshed_img.size
        # 類似度の合計が高いものを返す
        ret = ans.index(max(ans))
        # 7と1の誤検出率が高いのでアス比で判定します（えぇ）
        if ret == 7 or ret == 1:
            if trimmed_img.shape[0] / trimmed_img.shape[1] > 2.5:
                return 1
            else:
                return 7
        return ret

    def checkScore(trimmed_image: numpy.ndarray) -> int:
        """スコア領域部分の画像からスコアを検出する

        Args:
            trimmed_image (numpy.ndarray): スコアの領域を切り抜いた画像

        Returns:
            int: スコア
        """
        # 与えられた画像をHSVに変換、目的の色か否かで二値化して反転する
        hsv_image = cv2.cvtColor(trimmed_image, cv2.COLOR_BGR2HSV)
        LOWER: Final[tuple] = (0, 0, 200)
        UPPER: Final[tuple] = (180, 255, 255)
        bin_image = cv2.inRange(hsv_image, LOWER, UPPER)
        cv2.bitwise_not(bin_image)
        # 領域を検出する
        contours, _ = cv2.findContours(bin_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        # 与えられた画像の半分以上の高さがある領域の数字を判定して、x座標順に並べる
        anss = []
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                rect = contours[j]
                x, y, w, h = cv2.boundingRect(rect)
                if h > trimmed_image.shape[0] * 0.5:
                    anss.append([x, checknum(bin_image[y:y + h, x:x + w])])
        anss.sort()
        # x座標順に並べた数字を繋げてintにして返す（なければ0）
        ans = ""
        for i in anss:
            ans += str(i[1])
        if ans == "":
            ans = 0
        return int(ans)

    def checkJudge(trimmed_image: numpy.ndarray) -> int:
        """判定数表示部の画像から判定数を取得する（精度……）

        Args:
            trimmed_image (numpy.ndarray): 判定数表示部を切り抜いた画像

        Returns:
            int: 判定数
        """
        # 与えられた画像をHSVに変換して目的の色か否かで二値化、反転する
        img_hsv = cv2.cvtColor(trimmed_image, cv2.COLOR_BGR2HSV)
        LOWER: Final[tuple[int]] = (0, 0, 90)
        UPPER: Final[tuple[int]] = (180, 30, 130)
        bin_img = cv2.inRange(img_hsv, LOWER, UPPER)
        cv2.bitwise_not(bin_img)
        # 領域を検出する
        contours, _ = cv2.findContours(bin_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        # ある程度大きい領域のうち上半分に始点があるものを、縦幅を一番縦長だったものに合わせて判定する
        anss = []
        max_y, max_h = 0, 0
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                x, y, w, h = cv2.boundingRect(contours[j])
                if h > max_h:
                    max_y, max_h = y, h
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                if cv2.contourArea(contours[j]) < trimmed_image.shape[0] * 0.2:
                    continue
                x, y, w, h = cv2.boundingRect(contours[j])
                if y < trimmed_image.shape[0] * 0.4 and w < h:
                    anss.append([x, checknum(bin_img[max_y: max_y + max_h, x: x + w])])
        # x座標順に並べる
        anss.sort()
        # 繋げてintにして返す(なければ0)
        ans = ""
        for i in anss:
            ans += str(i[1])
        if ans == "":
            ans = 0
        return int(ans)

    def checkDiff(trimmed_img: numpy.ndarray) -> str:
        """難易度部分の画像から、楽曲の難易度を取得する

        Args:
            trimmed_img (numpy.ndarray): 難易度部分を切り抜いた画像

        Returns:
            str: 難易度を表す文字列
        """
        # 画像をHSVに変換、各難易度の色を検出して検出された範囲が一番広かった難易度を返す
        LOWERS: Final[list[tuple[int]]] = [(89, 100, 0), (35, 100, 0), (143, 100, 0), (168, 100, 0)]
        UPPERS: Final[list[tuple[int]]] = [(109, 255, 255), (55, 255, 255), (163, 255, 255), (180, 255, 255)]
        DIFF_NAMES: Final[list[int]] = ["past", "present", "future", "beyond"]
        hsv_img = cv2.cvtColor(trimmed_img, cv2.COLOR_BGR2HSV)
        val: list[int] = [0] * 4
        for i in range(4):
            bin_img = cv2.inRange(hsv_img, LOWERS[i], UPPERS[i])
            val[i] = numpy.sum(bin_img)
        return DIFF_NAMES[val.index(max(val))]

    result_data = json_funks.get(result_path)
    for image_path in image_paths:
        try:
            image: numpy.ndarray = cv2.imread(image_path)
            if image.shape[1] != settings["arcaea"]["size"]["width"] or image.shape[0] != settings["arcaea"]["size"]["height"]:
                raise
            result_data.append({
                "date": datetime.fromtimestamp(pathlib.Path(image_path).stat().st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                "filepath": image_path,
                "title": checkJacket(getarea(image, "jacket")),
                "diff": checkDiff(getarea(image, "level")),
                "score": checkScore(getarea(image, "score")),
                "pure": checkJudge(getarea(image, "pure")),
                "far": checkJudge(getarea(image, "far")),
                "lost": checkJudge(getarea(image, "lost"))
            })
        except Exception as e:
            print(e)
    json_funks.set(result_path, result_data)
