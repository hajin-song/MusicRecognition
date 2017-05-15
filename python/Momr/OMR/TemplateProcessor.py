import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
from Momr.OMR.constants import *

def remove_detected(img, row, col, box_width, box_height):
    top = -1
    bottom = -1
    for height in range(0, box_height):
        cur_width = 0
        for width in range(0, box_width):
            if img[row + height][col + width] != COLOR_WHITE:
                cur_width += 1
        if cur_width > 1:
            if bottom == -1:
                bottom = row + height
            else:
                top = row + height
            for width in range(0, box_width):
                img[row + height][col + width] = COLOR_WHITE
    return bottom, top

def detect_symbols(original, marked, template, color):
    symbols = defaultdict(lambda: defaultdict(dict))
    #print index
    w, h = template.shape[::-1]
    #print img.shape

    res = cv2.matchTemplate(original, template, cv2.TM_CCOEFF_NORMED)

    template = template.copy()
    #cv2.line(note, (0, h/2), (w, h/2), (0 , 0, 0))
    loc = np.where(res >= THRESHOLD)

    for index, pt in enumerate(zip(*loc[::-1])):
        #bottom, top = __remove_detected(original, pt[1], pt[0], w, h)
        x_key = str(pt[0])
        y_key = str(pt[1])
        symbols[x_key][y_key] = {}

    return symbols
