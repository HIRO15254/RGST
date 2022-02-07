import get_area
import cv2
import json_funks
from typing import Final, TypedDict

# 選択されている範囲の色
COLORS: Final[list[tuple[int]]] = [(239, 108, 58), (58, 239, 117), (58, 58, 239), (58, 58, 239), (58, 58, 239), (239, 58, 128)]
# 範囲選択ウィンドウのタイトル
WINDOW_TITLES: Final[list[str]] = [
    "Step 1: Select jacket area",
    "Step 2: Select score area",
    "Step 3-1: Select PURE judge count area",
    "Step 3-2: Select FAR judge count area",
    "Step 3-2: Select LOST judge count area",
    "Step 4: Select level area"]
GUIDE_WINDOW_TITLE: Final[str] = "Arcaea initialize setting guide"


class areaDict(TypedDict):
    x: int
    y: int
    w: int
    h: int


def arcaea_init(image_path: str, guide_image_path: str, settings_path: str):
    """arcaeaのリザルトを解析するに当たっての初期設定を行う

    Args:
        image_path (str): 初期設定時に表示する画像のパス
        guide_image_path (str): 設定方法を示した画像のパス
        settings_path (str): 作成した設定を書き込むファイルのパス
    """
    area: list[areaDict] = []
    # 画像の読み込み
    image = cv2.imread(image_path)
    guide_image = cv2.imread(guide_image_path)
    # ガイド画像ウィンドウの作成、表示
    cv2.namedWindow(GUIDE_WINDOW_TITLE, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(GUIDE_WINDOW_TITLE, guide_image.shape[1] // 2, guide_image.shape[0] // 2)
    cv2.imshow(GUIDE_WINDOW_TITLE, guide_image)
    # 6か所の設定範囲に対して範囲選択させる
    for i in range(len(WINDOW_TITLES)):
        try:
            area.append(get_area.get_area(WINDOW_TITLES[i], image, COLORS[i]))
            cv2.rectangle(image, (area[i]["x"], area[i]["y"]), (area[i]["x"] + area[i]["w"], area[i]["y"] + area[i]["h"]), COLORS[i], 4)
        # ウィンドウを閉じたことや異常終了を感知したら中止
        except Exception:
            break
    else:
        # 中止されなければjsonファイルに書き込む
        data = dict()
        data["arcaea"] = {
            "areas": {
                "jacket": area[0],
                "score": area[1],
                "pure": area[2],
                "far": area[3],
                "lost": area[4],
                "level": area[5]
            },
            "size": {
                "width": image.shape[1],
                "height": image.shape[0]
            },
            "initialized": "true"
        }
        json_funks.update(settings_path, data)
    cv2.destroyAllWindows()
