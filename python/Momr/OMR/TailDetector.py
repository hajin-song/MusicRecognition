import cv2
import numpy as np
import Traverser
from Momr.OMR.constants import *

def __bfs_x_limit(limit_x_0, limit_y_0, tail_direction, limit_x_1, limit_y_1, x_start, y_start, img, test):
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
        children = list(filter(lambda x: (x[0] > limit_x_0 and x[0] < limit_x_1), [(x-1, y-1), (x-1, y), (x, y-1), (x+1, y+1), (x+1, y), (x, y+1), (x-1,y+1), (x+1, y-1)]))
        children = list(filter(lambda x: img[x[1]][x[0]] < COLOR_THRSHOLD_BLACK, children))
        if x > right_most: right_most = x
        if y > bottom_most: y = bottom_most
        if y < top_most: y = top_most
        queue = queue + children

    #print limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, 'tttt'
    return (right_most, left_most, top_most, bottom_most)

def __bfs_y_limt(x_start, y_start, next_tail_x, next_tail_y, seen, image, test):
    queue = [(x_start, y_start)]
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
        children = list(filter(lambda x: (x[0] > x_start and x[0] < next_tail_x), [(x-1, y-1), (x-1, y), (x, y-1), (x+1, y+1), (x+1, y), (x, y+1), (x-1,y+1), (x+1, y-1)]))
        children = list(filter(lambda x: image[x[1]][x[0]] < COLOR_THRSHOLD_BLACK, children))
        if x > right_most: right_most = x
        if y > bottom_most: y = bottom_most
        if y < top_most: y = top_most
        queue = queue + children

    #print limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, 'tttt'
    return (right_most, left_most, seen)

def __process_tail_pixels(image, note, next_tail_x, next_tail_y, test):
    current_x = note.tail_x
    current_y = note.tail_y

    tail_cell = []
    seen = []
    while(image[current_y][current_x] <= 200):
        right_most, left_most, seen = __bfs_y_limt(current_x, current_y, next_tail_x, next_tail_y, seen, image, test)
        if(right_most - left_most != 0):
            tail_cell.append((left_most, right_most))
        if(note.tail_direction == 0):
            current_y += 1
        else:
            current_y -= 1
    return tail_cell

def find_tail_direction(image, row, col, height, width, test):
    """ Determine the tail direction of the given symbol
        :param image: source image
        :param row: y of symbol
        :param col: x of symbol
        :param height: height of the symbol image
        :param width: width of the symbol image
        :param test: DEBUG - used to mark the detected region
        returns 0 if upward, else 1
    """
    row += height/2 + 1
    col += width/2 + 1

    x_left = row - width
    x_right = row + width
    y = col

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
    """ Find given note's tail type
        :param image: source image
        :param note: note object
        :param next_tail_x: x position of next note
        :param next_tail_y: y position of next note
        :param test: DEBUG - used to mark the detected region
    """
    tail_type = note.tail_direction
    tail_x = note.tail_x
    tail_y = note.tail_y
    base_x = note.x
    base_y = note.y
    tail_info = __process_tail_pixels(image, note, next_tail_x, next_tail_y, test)
    #print tail_info
    if len(tail_info) == 0:
        cv2.rectangle(test, (note.tail_x, note.tail_y), (next_tail_x - 5, note.tail_y + 1),  (255, 255, ), 1)
        return 0, False
    else:
        longest = 0
        for info in tail_info:
            diff = abs(info[0] - info[1])
            if longest < diff:
                longest = diff
        if longest < 5:
            cv2.rectangle(test, (info[0], note.tail_y), (info[1], note.tail_y + 1),  (255, 0, 199), 1)
            return 0, False
        elif abs(longest - abs(tail_x - next_tail_x)) < 5 :
            cv2.rectangle(test, (info[0], note.tail_y), (info[1], note.tail_y + 1),  (255, 0, 0), 1)
            if(len(tail_info) == 1):
                return 1, True
            else:
                return 2, True
        else:
            cv2.rectangle(test, (info[0], note.tail_y), (info[1], note.tail_y + 1),  (0, 0, 255), 1)
            return 1, False
