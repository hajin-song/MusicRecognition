""" Traverser.py: Traverses the image from the given starting point """
__author__ = "Ha Jin Song"
__date__   = "05-June-2017"

#import cv2
import numpy as np
from Momr.OMR.constants import *

def __checkBound(x, y, width, height):
    return x >= 0 and y >= 0 and x < width and y < height

def leftTraverseSearch(img, x, y, test = ""):
    current = x
    h, w = img.shape[::]
    while(__checkBound(current, y, w, h) and img[y][current] >= COLOR_THRSHOLD_BLACK):
        current -= 1
    return abs(x - current)

def rightTraverseSearch(img, x, y, test):
    current = x
    h, w = img.shape[::]
    while(__checkBound(current, y, w, h) and img[y][current] >= COLOR_THRSHOLD_BLACK):
        current += 1
    return abs(x - current)

def leftTraverse(img, x, y, test = ""):
    current = x
    h, w = img.shape[::]
    while(__checkBound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        current -= 1
    return abs(x - current)

def rightTraverse(img, x, y, test):
    current = x
    h, w = img.shape[::]
    while(__checkBound(current, y, w, h) and img[y][current] < COLOR_THRSHOLD_BLACK):
        current += 1
    return abs(x - current)

def upTraverse(img, x, y, test):
    current = y
    h, w = img.shape[::]
    while(__checkBound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current -= 1
    return abs(y - current)

def downTraverse(img, x, y, test):
    current = y
    h, w = img.shape[::]
    while(__checkBound(x, current, w, h) and img[current][x] < COLOR_THRSHOLD_BLACK):
        current += 1
    return abs(y - current)
