import cv2
import numpy
from typing import TypedDict


class areaDict(TypedDict):
    x: int
    y: int
    w: int
    h: int


# グローバル変数宣言(あまりよくない)
drawing: bool = False
ix: int = -1
iy: int = -1


def get_area(title: str, image: numpy.ndarray, color: tuple[int, int, int] = (0, 255, 0)):
    """画像を表示し、ユーザーに範囲を選択させる

    Args:
        title (str): 画像を表示するウィンドウのパス
        img (numpy.ndarray): 表示する画像をimread等で読み込んだもの
        color (tuple[int, int, int], optional): 選択範囲の枠線の色(BGR)。規定値は緑(0,255,0)

    Returns:
        areaDict: 選択した範囲の左上座標と大きさ
    """
    data: areaDict = {"x": 0, "y": 0, "w": 0, "h": 0}

    def is_visible(title):
        """この関数で作成したウィンドウがまだ表示されているか調べる

        Returns:
            bool: この関数で作成したウィンドウがまだ表示されているか
        """
        try:
            ret = cv2.getWindowProperty(title, cv2.WND_PROP_VISIBLE)
            return bool(ret)
        except cv2.error:
            return False

    def draw_square(event: int, x: int, y: int, flags: int, param: areaDict):
        """マウス移動時に呼ばれるコールバック関数で、範囲に矩形を描画する

        Args:
            event (int): コールバック関数が呼ばれた理由 cv2.EVENT_xxx の形式
            x (int): マウスの(ウィンドウ上の)x座標
            y (int): マウスの(ウィンドウ上の)y座標
            flags (int): あるだけ
            param (object): 選択中の範囲を返す為の引数
        """
        global drawing, ix, iy

        def update(x, y):
            # 元画像をコピーして矩形を描画して更新する
            image_tmp = image.copy()
            cv2.rectangle(image_tmp, (ix, iy), (x, y), color, 4)
            cv2.imshow(title, image_tmp)

        # 左ボタンを押したら開始座標を設定し描画中フラグを立てる
        if event == cv2.EVENT_LBUTTONDOWN:
            drawing = True
            ix, iy = x, y
        # マウスが動いておりかる描画フラグが立っていれば矩形の表示を更新する
        elif event == cv2.EVENT_MOUSEMOVE:
            if drawing:
                update(x, y)
        # 左ボタンを離したら描画フラグを下ろして現在の矩形を固定し戻り値を更新する
        elif event == cv2.EVENT_LBUTTONUP:
            drawing = False
            update(x, y)
            param["x"] = min(ix, x)
            param["y"] = min(iy, y)
            param["w"] = abs(ix - x)
            param["h"] = abs(iy - y)

    # 指定した画像とタイトルでウィンドウを作成しマウス操作を設定して半分のサイズにする
    cv2.namedWindow(title, cv2.WINDOW_NORMAL)
    cv2.setMouseCallback(title, draw_square, data)
    cv2.resizeWindow(title, image.shape[1] // 2, image.shape[0] // 2)
    cv2.imshow(title, image)

    # キーを待ちつつウィンドウを閉じたかを監視する
    while(1):
        k = cv2.waitKey(1) & 0xFF
        if k == 13 and data["h"] > 10 and data["w"] > 10:  # Enterキー
            cv2.destroyWindow(title)
            return data
        elif k == 27 or (not is_visible(title)):  # Escapeキーかウィンドウ閉じる
            raise
