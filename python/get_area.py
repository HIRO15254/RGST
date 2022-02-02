import cv2
import numpy as np

def get_area(img, title, color = (0, 255, 0)):
    data = {"x": 0, "y": 0, "w": 0, "h": 0}
    
    global drawing, ix, iy
    drawing = False
    ix,iy = -1,-1

    def is_visible(winname):
        try:
            ret = cv2.getWindowProperty(
                winname, cv2.WND_PROP_VISIBLE
                )

            return bool(ret)

        except cv2.error:
            print("a")
            return False

    def draw_square(event,x,y,flags,param):

        global ix,iy,drawing

        def update(x, y):
            img_tmp = img.copy()
            cv2.rectangle(img_tmp, (ix, iy), (x, y), color, 4)
            cv2.imshow(title,img_tmp)

        if event == cv2.EVENT_LBUTTONDOWN:
            drawing = True
            ix, iy = x, y

        elif event == cv2.EVENT_MOUSEMOVE:
            if drawing:
                update(x, y)

        elif event == cv2.EVENT_LBUTTONUP:
            drawing = False
            update(x, y)
            param["x"] = min(ix, x)
            param["y"] = min(iy, y)
            param["w"] = abs(ix - x)
            param["h"] = abs(iy - y)

    cv2.namedWindow(title, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(title, img.shape[1] // 2, img.shape[0] // 2)
    cv2.setMouseCallback(title, draw_square, data)
    cv2.imshow(title,img)

    while(1):
        k = cv2.waitKey(1) & 0xFF
        if k == 13:
            cv2.imshow("check", img[data["y"]: data["y"] + data["h"], data["x"]: data["x"] + data["w"]])
            while(True):
                l = cv2.waitKey(1) & 0xFF
                if l == 13: #Enterキー
                    cv2.destroyWindow("check")
                    cv2.destroyWindow(title)
                    return data
                elif l == 8: #BackSpaceキー
                    cv2.destroyWindow("check")
                    break
                elif l == 27 or (not is_visible(title)) or (not is_visible("check")): #Escapeキーかウィンドウ閉じる
                    return -1
        elif k == 27 or (not is_visible(title)): #Escapeキーかウィンドウ閉じる
            return -1
