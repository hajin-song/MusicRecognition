import cv2
import numpy as np

def __traverseHorizontally(row, col, direction, img, sheet):
    #print "### START TRAVER RIGHT ###"
    while(True):
        #print img[row][col], row, col
        if(img[row][col] >= 140):
            #print cur_row, cur_col, img[cur_row][cur_col], "?"
            col -= (1 * direction)
            break
        else:
            #print cur_row, cur_col, img[cur_row][cur_col], "!"
            #cv2.rectangle(sheet, (col, row), (col+1, row+1), (255, 0, 255), 1)
            col += (1 * direction)
    #print "### END TRAVER RIGHT ###"
    return row, col

def __traverseVertically(row, col, direction, img, sheet):
    #print "### START TRAVER VERTICAL ###"
    while(True):
        #print cur_row, cur_col
        if(img[row][col] >= 140):
            #print row, cur_col, img[row][cur_col], "?"
            row += (1 * direction)
            break
        else:
            #print cur_row, cur_col, img[row][cur_col], "!"
            #cv2.rectangle(sheet, (col, row), (col+1,row+1), (0, 255, 255), 1)
            row -= (1 * direction)
    #print "### END TRAVER VERTICAL ###"
    return row, col

def classifyTail(row, col, w, h, sheet):
    img = cv2.cvtColor(sheet, cv2.COLOR_BGR2GRAY)

    direction = 1

    while(cur_row < row):
        if direction == -1: break
        cur_row = row + h/2
        cur_col = col + w/2
        cur_row, cur_col = __traverseHorizontally(cur_row, cur_col, direction, img, sheet)
        cur_row, cur_col = __traverseVertically(cur_row, cur_col, direction, img, sheet)
        diff_row = cur_row
        diff_col = cur_col
        prev_col = cur_col

        direction -1

    cur_row, cur_col = __traverseHorizontally(cur_row, cur_col, 1, img, sheet)
    #normal tail
    if(cur_col == prev_col):
        cv2.rectangle(sheet, (col + w/2, row + h/2), (col + w/2+1,row + h/2+1), (255, 0, 0), 1)
        return
    diff_row -= cur_row
    diff_col -= cur_col

    cur_row, cur_col = __traverseVertically(cur_row, cur_col, direction * -1, img, sheet)

    if(abs(diff_col) <= 5):
        cv2.rectangle(sheet, (col + w/2, row + h/2), (col + w/2+1,row + h/2+1), (255, 120, 255), 1)
        #print "not a connected note"
    else:
        cv2.rectangle(sheet, (col + w/2, row + h/2), (col + w/2+1,row + h/2+1), (0, 0, 255), 1)
        #print "conneted"

def classifyPitch(row, col, top, bottom, staveGroup):
    return 1

def classifyStaveGroup(row, col, top, bottom, staveGroup):
    return 1
