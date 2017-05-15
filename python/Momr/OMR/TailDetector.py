import cv2
import numpy as np
import Traverser
from Momr.OMR.constants import *

def __bfs_x_limit(limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, img, test):
    queue = [(x_start, y_start)]
    seen = []
    right_most = x_start
    left_most = x_start
    top_most = y_start
    bottom_most = y_start

    while len(queue) != 0:
        current = queue.pop(0)
        if current in seen: continue
        seen.append(current)
        x = current[0]
        y = current[1]
        cv2.rectangle(test, (x, y), (x + 1, y + 1),  (0, 240, 199), 1)
        children = list(filter(lambda x: (x[0] > limit_x_0 and x[0] < limit_x_1), [(x-1, y-1), (x-1, y), (x, y-1), (x+1, y+1), (x+1, y), (x, y+1), (x-1,y+1), (x+1, y-1)]))
        children = list(filter(lambda x: img[x[1]][x[0]] < COLOR_THRSHOLD_BLACK, children))
        if x > right_most: right_most = x
        if y > bottom_most: y = bottom_most
        if y < top_most: y = top_most
        queue = queue + children

    #print limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, 'tttt'
    return (right_most, left_most, top_most, bottom_most)

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

def find_tail_type(image, note, next_tail_x, next_tail_y, test):
    tail_type = note.tail_direction
    tail_x = note.tail_x
    tail_y = note.tail_y
    base_x = note.x
    base_y = note.y


    cv2.rectangle(test, (tail_x, tail_y + 3), (next_tail_x + 1, tail_y +4),  (255, 0, 0), 1)
    right_most, left_most, top_most, bottom_most =  __bfs_x_limit(tail_x, tail_y, next_tail_x, next_tail_y, tail_x, tail_y, image, test)
    if right_most == left_most and top_most == bottom_most:
        cv2.rectangle(test, (tail_x, tail_y - 5), (next_tail_x + 5, tail_y - 4),  (255, 0, 0), 1)
        return 0
    elif right_most >= next_tail_x - 1:
        cv2.rectangle(test, (tail_x, tail_y - -5), (next_tail_x + 5, tail_y - 4),  (0, 255, 0), 1)
        return 1
    else:
        cv2.rectangle(test, (tail_x, tail_y - 5), (next_tail_x + 5, tail_y - 4),  (0, 0, 255), 1)
        return 2
