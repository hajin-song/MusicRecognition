import cv2
import numpy as np
import staveProcessor
import noteProcessor
from collections import defaultdict

NORMAL = cv2.imread('./templates/symbol-note.png', 0) #symbol
HALF = cv2.imread('./templates/symbol-half.png', 0)
WHOLE = cv2.imread('./templates/symbol-whole.png', 0)
DOT = cv2.imread('./templates/symbol-dot.png', 0) #symbol
FLAT = cv2.imread('./templates/symbol-flat.png', 0)
SHARP = cv2.imread('./templates/symbol-sharp.png', 0)

NOTETYPE = [FLAT, SHARP, NORMAL, HALF, WHOLE]
COLOR = [(0,0,255), (0, 255, 0), (255, 0, 0),  (0, 255,255), (255, 0, 255), (120, 120, 120), (90, 180, 120), (10, 10, 10) ]
THRESHOLD = 0.7

symbols = defaultdict(lambda: defaultdict(dict))

def __removeDetected(img, row, col, box_width, box_height):
    top = -1
    bottom = -1
    for height in range(0, box_height):
        cur_width = 0
        for width in range(0, box_width):
            if img[row + height][col + width] != 255:
                cur_width += 1
        if cur_width > 1:
            if bottom == -1:
                bottom = row + height
            else:
                top = row + height
            for width in range(0, box_width):
                img[row + height][col + width] = 255
    return bottom, top


img, stave_groups = staveProcessor.cropStaves("../images/gs.jpg")
img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

original_img = img.copy()


print stave_groups


index = 0
for index, note in enumerate(NOTETYPE):
    #print index
    w, h = note.shape[::-1]
    #print img.shape
    res = cv2.matchTemplate(img, note,cv2.TM_CCOEFF_NORMED)

    loc = np.where( res >= THRESHOLD)
    for pt in zip(*loc[::-1]):
        #print index, pt
        symbols[pt[0]][pt[1]]["noteType"] = index
        if index > 1:
            bottom, top = __removeDetected(img, pt[1], pt[0], w, h)
            symbols[pt[0]][pt[1]]["bottom"] = bottom
            symbols[pt[0]][pt[1]]["top"] = top
            cv2.rectangle(img_rgb, pt, (pt[0] + w, pt[1] + h), COLOR[index], 1)

#symbols = sorted(symbols.iterkeys())

sortedX  = sorted(symbols.iterkeys())

for x in sortedX:
    print x, symbols[x]
    sortedY = sorted(symbols[x].iterkeys())
    for y in sortedY:
        imageType = symbols[x][y]["noteType"]
        if imageType == 2:
            w, h = NOTETYPE[imageType].shape[::-1]
            noteProcessor.classifyTail(y, x, w, h, img_rgb)


cv2.imwrite('res.png', img)


cv2.imwrite('res2.png', img_rgb)
