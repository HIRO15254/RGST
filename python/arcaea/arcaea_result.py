import cv2
from cv2 import imshow, waitKey
import numpy as np
import glob
import pathlib

def analyseArcaeaResult():

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
