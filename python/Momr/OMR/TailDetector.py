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

def __bfs_y_limit_right(x_start, y_start, next_tail_x, next_tail_y, seen, image, test):
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
        children = list(filter(lambda x: (x[0] > x_start and x[0] < next_tail_x), [(x, y-1), (x+1, y+1), (x+1, y), (x, y+1), (x+1, y-1)]))
        children = list(filter(lambda x: image[x[1]][x[0]] < COLOR_THRSHOLD_BLACK, children))
        if x > right_most: right_most = x
        if y > bottom_most: y = bottom_most
        if y < top_most: y = top_most
        queue = queue + children
        image[y][x] = 255
    #print limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, 'tttt'
    return (right_most, left_most, seen)

def __bfs_y_limit_left(x_start, y_start, prev_tail_x, prev_tail_y, seen, image, test):
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
        children = list(filter(lambda x: (x[0] < x_start and x[0] > prev_tail_x), [(x-1, y-1), (x-1, y), (x, y-1), (x, y+1), (x-1,y+1)]))
        children = list(filter(lambda x: image[x[1]][x[0]] < COLOR_THRSHOLD_BLACK, children))
        if x < left_most: left_most = x
        if y > bottom_most: y = bottom_most
        if y < top_most: y = top_most
        queue = queue + children
        image[y][x] = 255


    #print limit_x_0, limit_y_0, limit_x_1, limit_y_1, x_start, y_start, 'tttt'
    return (right_most, left_most, seen)


def __process_tail_pixels(image, note, prev_tail_x, prev_tail_y, next_tail_x, next_tail_y, test):
    """
        :param image: source image
        :param note: Note being checked
        :param prev_tail_x: previous note tail's X value
        :param prev_tail_y: previous note tail's Y value
        :param next_tail_x: next note tail's X value
        :param next_tail_y: next note tail's Y value
        :param test: DEBUG - used to mark the detected region
        returns tails information of both sides of the given note
    """
    current_x = note.tail_x
    current_y = note.tail_y

    tail_cell_right = []
    tail_cell_left = []
    seen = []
    seen_2 = []
    # Travese until end of the tail
    while(image[current_y][current_x] <= 200):
        # Check if anything is branch out of the tail on current position
        right_most, left_most, seen = __bfs_y_limit_right(current_x, current_y, next_tail_x, next_tail_y, seen, image, test)
        # For the left side, avoid confusing the note body with the tail information
        if (note.y < current_y and note.tail_direction == 1) or (note.y > current_y and note.tail_direction == 0):
            right_most_2, left_most_2, seen_2 = __bfs_y_limit_left(current_x - 1, current_y, prev_tail_x, prev_tail_y, seen_2, image, test)
            if(right_most_2 - left_most_2 != 0):
                tail_cell_left.append((left_most_2, right_most_2))

        if(right_most - left_most != 0):
            tail_cell_right.append((left_most, right_most))

        if(note.tail_direction == 0): current_y += 1
        else: current_y -= 1
    return list(set(tail_cell_right)), list(set(tail_cell_left))

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

def find_tail_type(image, note, prev_note, next_note, test):
    """ Find given note's tail type
        :param image: source image
        :param note: note object
        :param prev_note: previous note
        :param next_note: next note
        :param test: DEBUG - used to mark the detected region
    """
    tail_type = note.tail_direction
    tail_x = note.tail_x
    tail_y = note.tail_y
    base_x = note.x
    base_y = note.y
    prev_tail_x = prev_note.tail_x
    prev_tail_y = prev_note.tail_y
    next_tail_x = next_note.tail_x
    next_tail_y = next_note.tail_y

    # Check both direction - bar notes can have tail information on both sides
    tail_info_right, tail_info_left = __process_tail_pixels(image, note, prev_tail_x, prev_tail_y, next_tail_x, next_tail_y, test)
    #print note, tail_info_right, tail_info_left
    #print tail_info_right
    if len(tail_info_right) == 0 and len(tail_info_left) == 0:
        cv2.rectangle(test, (note.tail_x, note.tail_y), (note.tail_x+ 10, note.tail_y + 10),  (0, 102, 255), 1)
        return 0, 0
    else:
        longest = 0
        prev = (0, 0)
        #print note
        tail_info_right = [x for x in tail_info_right if abs(x[0] - x[1]) >= 3]
        tail_info_left = [x for x in tail_info_left if abs(x[0] - x[1]) >= 3]
        for index, info in enumerate(tail_info_right):
            if(abs(prev[1] - info[1]) <= 1):
                cur_index = tail_info_right.index(info)
                del tail_info_right[cur_index]
                continue
            diff = abs(info[0] - info[1])
            if longest < diff:
                longest = diff
                prev = info
                #print '\t', 'passed'


        if longest < (abs(next_tail_x - tail_x)/2):
            cv2.rectangle(test, (note.tail_x, note.tail_y), (note.tail_x+10, note.tail_y + 10),  (125, 0, 255), 1)
            return len(tail_info_right), 0
        else :
            if(len(tail_info_right) <= 1 and len(tail_info_left) <= 1):
                if(len(tail_info_right) == 0):
                    cv2.rectangle(test, (note.tail_x, note.tail_y), (note.tail_x+10, note.tail_y + 10),  (255, 0, 120), 1)
                    return len(tail_info_left), 2
                cv2.rectangle(test, (note.tail_x, note.tail_y), (note.tail_x+10, note.tail_y + 10),  (255, 0, 0), 1)
                return 1, 1
            else:
                cv2.rectangle(test, (note.tail_x, note.tail_y), (note.tail_x+10, note.tail_y + 10),  (0, 255,0), 1)
                return max(len(tail_info_right), len(tail_info_left)), 1
