import cv2
import numpy as np
import Traverser

def find_tail_direction(image, row, col, height, width, test):
    row += height/2 + 1
    col += width/2 + 1
    x_left = row
    x_right = row
    y = col

    x_left -= Traverser.left_traverse(image, x_left, y, test)
    x_right += Traverser.right_traverse(image, x_right, y, test)

    upward_y = 0
    upward_x = 0
    downward_y = 0
    downward_x = 0

    while(x_right > row):
        traversed = Traverser.up_traverse(image, x_right, y, test)
        if(traversed >  upward_y):
            upward_y = traversed
            upward_x = x_right
        x_right -= 1

    while(x_left < row):
        traversed = Traverser.down_traverse(image, x_left, y, test)
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
    print current, base_y
    print "to_left"
    if(tail_type == 0):
        while(current < base_y):
            print Traverser.right_traverse(image, tail_x, current, test)
            current += 1
    else:
        while(current > base_y):
            print Traverser.right_traverse(image, tail_x, current, test)
            current -= 1
    return 1
