import re
import cv2
import numpy as np
import glob

import json_funks

def analyseArcaeaResult(imagepath, settingspath, jacketpath, datapath, numpath, resultjsonpath):

    settings = json_funks.get_json(settingspath);
    data = json_funks.get_json(datapath);
    areas = settings["arcaea"]["areas"]
    img = cv2.imread(imagepath)


    def getarea(image, name):
        return image[areas[name]["y"]: areas[name]["y"] + areas[name]["h"], areas[name]["x"]: areas[name]["x"] + areas[name]["w"]]


    def checkJacket(img):
        resized_img = cv2.resize(img, (256, 256))
        img_hists = []
        cv2.waitKey(0)
        for i in range(3):
            img_hists.append(cv2.calcHist([resized_img], [i], None, [256], [0, 256]))
        jackets = glob.glob(f"{jacketpath}/*")
        best_num, best_val = 0, 0
        for i in range(len(jackets)):
            jacket_hists = np.load(jackets[i])
            ret = cv2.compareHist(img_hists[0], jacket_hists["b"], 0)
            ret += cv2.compareHist(img_hists[1], jacket_hists["g"], 0)
            ret += cv2.compareHist(img_hists[2], jacket_hists["r"], 0)
            if best_val < ret:
                best_num = int(re.search("jacket(\d{1,3})[abcdefg]\.npz", jackets[i]).group(1))
                best_val = ret
        return [k for k, v in data["musics"].items() if v["id"] == best_num][0]


    def checknum(img):
        num_imgs = [[] for _ in range(10)]
        for i in range(10):
            num_paths = glob.glob(f"{numpath}/{i}/*")
            for num_path in num_paths:
                num_imgs[i].append(cv2.imread(num_path, cv2.IMREAD_GRAYSCALE))
        ans = [0 for i in range(10)]
        for i in range(10):
            for num_img in num_imgs[i]:
                resized_img = cv2.resize(img, (num_img.shape[1], num_img.shape[0]))
                _, threshed_img = cv2.threshold(resized_img, 128, 255, cv2.THRESH_BINARY)
                ans[i] += np.count_nonzero(threshed_img == num_img) / threshed_img.size
        ret = ans.index(max(ans))
        if ret == 7 or ret == 1:
            if img.shape[0] / img.shape[1] > 2.5:
                return 1
            else:
                return 7
        return ret


    def checkScore(img):
        img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = (0, 0, 200)
        upper = (180, 255, 255)
        bin_img = cv2.inRange(img_hsv, lower, upper)
        cv2.bitwise_not(bin_img)
        contours, _ = cv2.findContours(bin_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        anss = []
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                rect = contours[j]
                x, y, w, h = cv2.boundingRect(rect)
                if h > img.shape[0] * 0.5:
                    anss.append([x, checknum(bin_img[y:y + h, x:x + w])])
        anss.sort()
        ans = ""
        for i in anss:
            ans += str(i[1])
        if ans == "":
            ans = 0
        return int(ans)

    def checkJudge(img):
        img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = (0, 0, 90)
        upper = (180, 30, 130)
        bin_img = cv2.inRange(img_hsv, lower, upper)
        cv2.bitwise_not(bin_img)
        contours, _ = cv2.findContours(bin_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        anss = []
        max_y, max_h = 0, 0
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                x, y, w, h = cv2.boundingRect(contours[j])
                if h > max_h:
                    max_y, max_h = y, h
        for j in range(0, len(contours)):
            if len(contours[j]) > 0:
                if cv2.contourArea(contours[j]) < img.shape[0] * 0.2:
                    continue
                x, y, w, h = cv2.boundingRect(contours[j])
                if y < img.shape[0] * 0.4:
                    anss.append([x, checknum(bin_img[max_y: max_y + max_h, x: x + w])])
        anss.sort()
        ans = ""
        for i in anss:
            ans += str(i[1])
        if ans == "":
            ans = 0
        return int(ans)

    def checkDiff(img):
        img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = [(89, 242, 179), (35, 132, 130), (143, 178, 67), (168, 178, 120)]
        upper = [(109, 262, 199), (55, 152, 150), (163, 198, 87), (180, 198, 140)]
        val = [[] for _ in range(4)]
        for i in range(4):
            bin_img = cv2.inRange(img_hsv, lower[i], upper[i])
            val[i] = np.sum(bin_img)
        print(val)
        return val.index(max(val))

    ret_data = json_funks.get_json(resultjsonpath)
    id = len(ret_data) + 1
    ret_data[id] = {
        "title": checkJacket(getarea(img, "jacket")),
        "diff": checkDiff(getarea(img, "level")),
        "score": checkScore(getarea(img, "score")),
        "pure": checkJudge(getarea(img, "pure")),
        "far": checkJudge(getarea(img, "far")),
        "lost": checkJudge(getarea(img, "lost"))
    }
    json_funks.set_json(resultjsonpath, ret_data)
