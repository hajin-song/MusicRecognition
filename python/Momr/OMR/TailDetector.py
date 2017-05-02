import cv2
import numpy as np
from Momr.OMR.constants import *
import Traverser

def find_tail_direction(image, row, col, height, width, test):
    x_left = row + height/2 + 1
    x_right = row + height/2 + 1
    row = row + height/2 + 1
    y = col + width/2 + 1
    #print x_left, col
    print "start", x_left, x_right

    while image[y][x_left] < COLOR_THRSHOLD_BLACK:
        x_left -= 1

    while image[y][x_right] < COLOR_THRSHOLD_BLACK:
        x_right += 1
    upward = 0
    downward = 0

    while(x_right > row):
        traversed = Traverser.up_traverse(image, x_right, y, test)
        if(traversed >  upward): upward = traversed
        x_right -= 1

    while(x_left < row):
        traversed = Traverser.down_traverse(image, x_left, y, test)
        if(traversed >  downward): downward = traversed
        x_left += 1
    print upward, downward
    return 0 if upward > downward else 1
