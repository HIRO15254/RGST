import cv2
from cv2 import imshow, waitKey
import numpy as np
import glob
import pathlib


def getJacketPlace(imgs):
    """ジャケットの位置を検出する"""
    imgs = list(map(lambda x: x[0:x.shape[0], 0:x.shape[1] // 2], imgs))
    # 差分を用意する
    imgs_diff = []
    imgs_diff.append(cv2.absdiff(imgs[0], imgs[1]))
    imgs_diff.append(cv2.absdiff(imgs[1], imgs[2]))

    # 差分をグレースケール化して
    imgs_diff_gray = []
    imgs_diff_gray.append(cv2.cvtColor(imgs_diff[0], cv2.COLOR_BGR2GRAY))
    imgs_diff_gray.append(cv2.cvtColor(imgs_diff[1], cv2.COLOR_BGR2GRAY))

    # 二値化する
    imgs_thresh = []
    imgs_thresh.append(cv2.threshold(imgs_diff_gray[0], 10, 255, cv2.THRESH_BINARY)[1])
    imgs_thresh.append(cv2.threshold(imgs_diff_gray[1], 10, 255, cv2.THRESH_BINARY)[1])

    # 2枚の差分二値化画像で両方が違う場所を検出する
    image_result = cv2.bitwise_and(imgs_thresh[0], imgs_thresh[1])

    # 二値化した画像の領域を検出する
    contours, hierarchy = cv2.findContours(image_result, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

    # 正方形に近い結果
    retx, rety, retw, reth = 0, 0, 0, 0
    # 正方形ではないが最大の結果
    bigx, bigy, bigw, bigh = 0, 0, 0, 0
    for i in range(0, len(contours)):
        if len(contours[i]) > 0:

            # 100*100以下の部分は無視
            if cv2.contourArea(contours[i]) < 10000:
                continue

            rect = contours[i]
            x, y, w, h = cv2.boundingRect(rect)
            if w > bigw:
                bigx, bigy, bigw, bigh = x, y, w, h
            if w > retw and abs(w - h) < 10:
                retx, rety, retw, reth = x, y, w, h

    # 正方形に近い領域があればそこを返す
    # なければおそらくスコア表示部分も含めてしまっているので、左端を揃えて正方形にして返す
    if retw != 0:
        return retx, rety, retw, reth
    elif bigw != 0:
        return bigx, bigy, bigh, bigh
    # どうしても見つからなければ適当な値を返す
    # TODO: エラー処理
    else:
        return 1, 1, 1, 1


def getScorePlace(img, miny):
    """スコアの位置を検出する"""
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # それぞれ通常時、ハイスコア時のスコア表示部が含まれそうな色範囲(HSV)
    lower = [(125, 52, 0), (125, 67, 0)]
    upper = [(140, 67, 255), (140, 87, 255)]
    retx, rety, retw, reth = 0, 0, 0, 0

    # 通常時、ハイスコア時それぞれについてその色の範囲を検出
    for i in range(2):
        bin_img = cv2.inRange(img_hsv, lower[i], upper[i])
        contours, hierarchy = cv2.findContours(bin_img, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

        for j in range(0, len(contours)):
            if len(contours[j]) > 0:

                # 小さい範囲は無視
                if cv2.contourArea(contours[j]) < 1000:
                    continue

                rect = contours[j]
                x, y, w, h = cv2.boundingRect(rect)
                # 上端がジャケットの上端より下にあり、横幅が縦幅の5倍以上を満たす範囲のうち最大の範囲を返す
                if w > h * 5 and retw * reth < w * h and miny < y:
                    retx, rety, retw, reth = x, y, w, h

    # 邪魔なので端一割を削る
    return int(retx + retw * 0.1), rety, int(retw * 0.8), reth


def getJudgePlace(img, sco_x, sco_y, sco_w, sco_h):
    lower = (0, 0, 90)
    upper = (180, 15, 130)
    img_hsv = cv2.cvtColor(img[sco_y + sco_h:, int(sco_x + sco_w * 0.25) :int(sco_x + sco_w * 0.75)], cv2.COLOR_BGR2HSV)
    bin_img = cv2.inRange(img_hsv, lower, upper)

    bin_img_2 = np.zeros(bin_img.shape, "uint8")
    for i in range(1, bin_img.shape[0]):
        for j in range(1,bin_img.shape[1]):
            val = 0
            for k in range(-1,1):
                for l in range(-1,1):
                    val = val + bin_img[i + k, j + l]
            bin_img_2[i,j] = min(val, 255)

    contours, _ = cv2.findContours(bin_img_2, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    big_h = 0
    for j in range(0, len(contours)):
        if len(contours[j]) > 0:

            # 小さい範囲は無視
            if cv2.contourArea(contours[j]) < 50:
                continue

            rect = contours[j]
            x, y, w, h = cv2.boundingRect(rect)
            big_h = max(h, big_h)

    for j in range(0, len(contours)):
        if len(contours[j]) > 0:

            rect = contours[j]
            x, y, w, h = cv2.boundingRect(rect)
            if h > big_h * 0.8:
                cv2.rectangle(bin_img_2, (x, y), (x + w, y + h), 128, 1)
    cv2.imshow("a", bin_img_2)
    cv2.waitKey(0)


def checkScore(img):
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower = (0, 0, 200)
    upper = (180, 255, 255)
    bin_img = cv2.inRange(img_hsv, lower, upper)
    cv2.bitwise_not(bin_img)
    contours, hierarchy = cv2.findContours(bin_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    anss = []
    for j in range(0, len(contours)):
        if len(contours[j]) > 0:

            # remove small objects
            if cv2.contourArea(contours[j]) < 100:
                continue

            rect = contours[j]
            x, y, w, h = cv2.boundingRect(rect)
            if h > img.shape[0] * 0.5:
                anss.append([x, checknum(bin_img[y:y + h, x:x + w], num_imgs)])
    anss.sort()
    ans = ""
    for i in anss:
        ans += str(i[1])
    return int(ans)


def checkJacket(img, jacket_hists):
    resized_img = cv2.resize(img, (200, 200))
    img_hist = cv2.calcHist([resized_img], [0], None, [256], [0, 256])

    best_no, best_val = 0, 0
    for k in range(len(jacket_hists)):
        ret = cv2.compareHist(img_hist, jacket_hists[k], 0)
        if best_val < ret:
            best_no = k
            best_val = ret
    print(f"image is j{best_no + 1} : {int(best_val * 10000) / 100} %")


def checknum(img, num_imgs):
    ans = [[] for i in range(10)]
    ans_2 = [0] * 10
    for i in range(10):
        for j in num_imgs[i]:
            resized_img = cv2.resize(img, (j.shape[1], j.shape[0]))
            _, threshed_img = cv2.threshold(resized_img, 128, 255, cv2.THRESH_BINARY)
            ans[i].append(np.count_nonzero(threshed_img == j) / threshed_img.size)
        ans_2[i] = np.average(ans[i])
    return ans_2.index(max(ans_2))


jacket_hists = []
files = glob.glob("./jacket/*")
for file in files:
    jacket = cv2.imread(file)
    resized_jacket = cv2.resize(jacket, (200, 200))
    jacket_hists.append(cv2.calcHist([resized_jacket], [0], None, [256], [0, 256]))

num_imgs = [[] for i in range(10)]
for i in range(10):
    files = glob.glob(f"./num/{i}/*")
    for file in files:
        img = cv2.imread(file, cv2.IMREAD_GRAYSCALE)
        ret, img_thresh = cv2.threshold(img, 100, 255, cv2.THRESH_BINARY)
        num_imgs[i].append(cv2.imread(file, cv2.IMREAD_GRAYSCALE))

for i in range(0, 34):
    # 画像の読み込み
    imgs = []
    for j in range(3):
        path = str(pathlib.Path(__file__).parent)
        imgs.append(cv2.imread(f"{path}/image/ss{i * 3 + j + 1}.png"))

    jacx, jacy, jacw, jach = getJacketPlace(imgs)
    scox, scoy, scow, scoh = 0, 0, 0, 0
    for j in range(3):
        _scox, _scoy, _scow, _scoh = getScorePlace(imgs[j], jacy)
        if _scox != 0:
            scox, scoy, scow, scoh = _scox, _scoy, _scow, _scoh
            break
    for j in range(3):
        getJudgePlace(imgs[j], scox, scoy, scow, scoh)

    for j in range(3):
        print(i * 3 + j + 1)
        checkJacket(imgs[j][jacy:jacy + jach, jacx:jacx + jacw], jacket_hists)
        print(checkScore(imgs[j][scoy:scoy + scoh, scox:scox + scow]))
cv2.destroyAllWindows()
