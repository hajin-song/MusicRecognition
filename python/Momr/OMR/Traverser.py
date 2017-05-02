import cv2
import numpy as np
from Momr.OMR.constants import *

def __check_bound(x, y, width, height):
    return x >= 0 and y >= 0 and x <= width and y <= height

def left_traverse(img, x, y, test = ""):
    current = x
    w, h = img.shape[::-1]
    while(__check_bound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        current -= 1
    return abs(x - current)

def right_traverse(img, x, y, test):
    current = x
    w, h = img.shape[::-1]
    while(__check_bound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        cv2.rectangle(test, (current, y), (current + 1, y + 1),  (255, 0, 255), 1)
        current += 1
    return abs(x - current)

def up_traverse(img, x, y, test):
    current = y
    w, h = img.shape[::-1]
    while(__check_bound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current -= 1
    return abs(y - current)

def down_traverse(img, x, y, test):
    current = y
    w, h = img.shape[::-1]
    while(__check_bound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current += 1
    return abs(y - current)
