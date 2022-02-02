import get_area
import cv2
import json

COLORS = [(239, 108, 58), (58, 239, 117), (58, 58, 239), (58, 58, 239), (58, 58, 239), (239, 58, 128)]
WIN_TITLES = ["Step 1: Select jacket area",
              "Step 2: Select score area",
              "Step 3-1: Select PURE judge count area",
              "Step 3-2: Select FAR judge count area",
              "Step 3-2: Select LOST judge count area",
              "Step 4: Select level area"]

def arcaea_init(imgpath, guidepath):
    area = []
    guideimg = cv2.imread(guidepath)
    img = cv2.imread(imgpath)
    t = "guide"
    cv2.namedWindow(t, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(t, img.shape[1] // 2, img.shape[0] // 2)
    cv2.imshow(t, guideimg)
    for i in range(6):
        area.append(get_area.get_area(img, WIN_TITLES[i], COLORS[i]))
        if area[-1] == -1:
            break
        cv2.rectangle(img, (area[i]["x"], area[i]["y"]), (area[i]["x"] + area[i]["w"], area[i]["y"] + area[i]["h"]), COLORS[i], 4)
    else:
        data = dict()
        with open('settings.json', mode='rt', encoding='utf-8') as file:
            data = json.load(file)
        data["arcaea"] = {
            "jacket": area[0],
            "score": area[1],
            "pure": area[2],
            "far": area[3],
            "lost": area[4],
            "level": area[5]
        }
        with open('settings.json', mode='wt', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)

    cv2.destroyAllWindows()