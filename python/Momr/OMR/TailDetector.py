import cv2
import numpy as np
import Traverser

def find_tail_direction(image, row, col, height, width, test):
    row += height/2 + 1
    col += width/2 + 1
    cv2.rectangle(test, (row, col), (row + 2, col + 2),  (108, 85, 135), 1)
    x_left = row - width
    x_right = row + width
    y = col

    cv2.rectangle(test, (x_left, y), (x_left + 2, y + 2),  (64, 177, 212), 1)
    cv2.rectangle(test, (x_right, y), (x_right + 2, y + 2),  (81, 240, 108), 1)

    x_left += Traverser.rightTraverseSearch(image, x_left, y, test)
    x_right -= Traverser.leftTraverseSearch(image, x_right, y, test)
    #cv2.rectangle(test, (x_left, y), (x_left + 2, y + 2),  (81, 240, 108), 1)
    #cv2.rectangle(test, (x_right, y), (x_right + 2, y + 2),  (81, 240, 108), 1)
    upward_y = 0
    upward_x = 0
    downward_y = 0
    downward_x = 0

    while(x_right > row):
        traversed = Traverser.upTraverse(image, x_right, y, test)
        if(traversed >  upward_y):
            upward_y = traversed
            upward_x = x_right
        x_right -= 1

    while(x_left < row):
        traversed = Traverser.downTraverse(image, x_left, y, test)
        if(traversed >  downward_y):
            downward_y = traversed
            downward_x = x_left
        x_left += 1

    if(upward_y > downward_y):
        return 0, upward_x, y - upward_y + 1
    return 1, downward_x, y + downward_y - 1

def find_tail_type(image, tail_type, tail_x, tail_y, base_x, base_y, height, width, test):
    extruding = 0
    current = tail_y
    if(tail_type == 0):
        while(current < base_y):
            Traverser.rightTraverse(image, tail_x, current, test)
            current += 1
    else:
        while(current > base_y):
            Traverser.rightTraverse(image, tail_x, current, test)
            current -= 1
    return 1
