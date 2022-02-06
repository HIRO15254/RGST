import cv2
import numpy as np
import os


def replace_hist(image_path: str):
    """ヒストグラムのnpzファイルでで画像を置き換える

    Args:
        image_path (str): 置き換える画像のパス
    """
    img: np.ndarray = cv2.imread(image_path)
    resized_img: np.ndarray = cv2.resize(img, (256, 256))
    img_hists: list[np.ndarray] = []

    # B,G,Rそれぞれについてヒストグラムを作成して、まとめてnpzファイルに保存する
    for i in range(3):
        img_hists.append(cv2.calcHist([resized_img], [i], None, [256], [0, 256]))
    np.savez(f"{image_path[:-4]}", b=img_hists[0], g=img_hists[1], r=img_hists[2])

    # 元ファイル削除
    os.remove(image_path)
