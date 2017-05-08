import cv2
import numpy as np
from Momr.OMR.constants import *

def __checkBound(x, y, width, height):
    return x >= 0 and y >= 0 and x <= width and y <= height

def leftTraverseSearch(img, x, y, test = ""):
    current = x
    w, h = img.shape[::-1]
    while(__checkBound(current, y, w, h) and img[y][current] >= COLOR_THRSHOLD_BLACK):
        cv2.rectangle(test, (current, y), (current + 1, y + 1),  (255, 0, 255), 1)
        current -= 1
    return abs(x - current)

def rightTraverseSearch(img, x, y, test):
    current = x
    w, h = img.shape[::-1]
    while(__checkBound(current, y, w, h) and img[y][current] >= COLOR_THRSHOLD_BLACK):
        cv2.rectangle(test, (current, y), (current + 1, y + 1),  (255, 0, 255), 1)
        current += 1
    return abs(x - current)

def leftTraverse(img, x, y, test = ""):
    current = x
    w, h = img.shape[::-1]
    cv2.rectangle(test, (current, y), (current + 1, y + 1),  (6, 67, 16), 1)
    while(__checkBound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        cv2.rectangle(test, (current, y), (current + 1, y + 1),  (6, 67, 16), 1)
        current -= 1
    return abs(x - current)

def rightTraverse(img, x, y, test):
    current = x
    w, h = img.shape[::-1]
    while(__checkBound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        cv2.rectangle(test, (current, y), (current + 1, y + 1),  (255, 0, 255), 1)
        current += 1
    return abs(x - current)

def upTraverse(img, x, y, test):
    current = y
    w, h = img.shape[::-1]
    while(__checkBound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current -= 1
    if current != y:
        cv2.rectangle(test, (x, current), (x + 1, current + 1),  (255, 0, 255), 1)
    return abs(y - current)

def downTraverse(img, x, y, test):
    current = y
    w, h = img.shape[::-1]
    while(__checkBound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current += 1
    if current !=y:
        cv2.rectangle(test, (x, current), (x + 1, current + 1),  (255, 0, 255), 1)
    return abs(y - current)
