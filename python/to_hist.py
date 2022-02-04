import cv2
from cv2 import imwrite
import numpy as np
import os

def toHist(imagepath):
    img = cv2.imread(imagepath)
    resized_image = cv2.resize(img, (256, 256))
    img_hists = []
    for i in range(3):
        img_hists.append(cv2.calcHist([resized_image], [i], None, [256], [0, 256]))
    np.savez(f"{imagepath[:-4]}", b=img_hists[0], g=img_hists[1], r=img_hists[2])
    os.remove(imagepath)