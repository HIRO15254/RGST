import cv2
import numpy as np
import os


def replace_npy(image_path: str):
    """ヒストグラムのnpzファイルでで画像を置き換える

    Args:
        image_path (str): 置き換える画像のパス
    """
    img: np.ndarray = cv2.imread(image_path)
    resized_img: np.ndarray = cv2.resize(img, (256, 256))
    np.save(f"{image_path[:-4]}", resized_img)

    # 元ファイル削除
    os.remove(image_path)
