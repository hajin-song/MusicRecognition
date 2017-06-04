""" TemplateProcessor.py: Performs Templating Matching """
__author__ = "Ha Jin Song"
__date__   = "05-June-2017"

import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
from Momr.OMR.constants import *

def remove_detected(img, row, col, width, height):
    """ Removes the region from the image - Debug purpose only
        @param img: target image
        @param row: starting of region (y)
        @param col: starting of the region (x)
        @param width: Width of the region
        @param height: Height of the region
    """
    top = -1
    bottom = -1
    for height in range(0, height):
        cur_width = 0
        for width in range(0, width):
            if img[row + height][col + width] != COLOR_WHITE:
                cur_width += 1
        if cur_width > 1:
            if bottom == -1:
                bottom = row + height
            else:
                top = row + height
            for width in range(0, width):
                img[row + height][col + width] = COLOR_WHITE

def detect_symbols(original, marked, template, color):
    """ Interface to OpenCV's tempalte matching
        @param original: Image being matched on
        @mparam marked: DEBUG - Marker image
        @param template: Template image in form of numpy array
        @param color: DEBUG - color of the marker
        @returns: List of coordinates that matched
        @rtypes: List of Coordinates (x,y)
    """
    symbols = defaultdict(lambda: defaultdict(dict))
    h, w = template.shape[::]

    res = cv2.matchTemplate(original, template, cv2.TM_CCOEFF_NORMED)

    template = template.copy()
    loc = np.where(res >= THRESHOLD)

    for index, pt in enumerate(zip(*loc[::-1])):
        x_key = str(pt[0])
        y_key = str(pt[1])
        symbols[x_key][y_key] = {}

    return symbols
