import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
from Momr.OMR.constants import *

def __check_bound(img, x, y):
    w, h = img.shape[::-1]
    return x >= 0 and y >= 0 and x <= w and y <= h

def left_traverse(img, x, y):
    current = x
    while(__check_bound(img, x, current) and img[y][current] < COLOR_THRSHOLD_BLACK):
        current -= 1
    return current

def right_traverse(img, x, y):
    current = x
    while(__check_bound(img, x, current) and img[y][current] < COLOR_THRSHOLD_BLACK):
        current += 1
    return current

def up_traverse(img, x, y, test):
    current = y
    #cv2.rectangle(test, (y, x), (y + 1, x + 1), (125,0 ,125), 1)
    while(__check_bound(img, x, current) and img[current][x] < COLOR_THRSHOLD_BLACK):
        #cv2.rectangle(test, (x, current), (x + 1, current + 1), (125, 125 , 0), 1)
        current -= 1
    return abs(y-current)

def down_traverse(img, x, y, test):
    current = y
    color = 120
    while(__check_bound(img, x, current) and img[current][x] < COLOR_THRSHOLD_BLACK):
        #cv2.rectangle(test, (x, current), (x + 1, current + 1), (125, 0 , 125), 1)
        current += 1
    return abs(y-current)
