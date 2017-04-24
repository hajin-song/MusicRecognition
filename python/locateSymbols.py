import sys
import cv2
import numpy as np
import noteProcessor
from collections import defaultdict


NORMAL = cv2.imread('./image/symbol-note.png', 0) #symbol
#HALF = cv2.imread('./image/symbol-half.png', 0)
#WHOLE = cv2.imread('./imageimage/symbol-whole.png', 0)
#DOT = cv2.imread('./image/symbol-dot.png', 0) #symbol
#FLAT = cv2.imread('./image/symbol-flat.png', 0)
#SHARP = cv2.imread('./image/symbol-sharp.png', 0)

NOTETYPE = []
COLOR = [(255,0,0), (0, 255, 0), (0, 0, 255),  (0, 255,255), (255, 0, 255), (120, 120, 120), (90, 180, 120), (10, 10, 10) ]
THRESHOLD = 0.7

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

def detectSymbols(original, marked):
    symbols = defaultdict(lambda: defaultdict(dict))

    for index, note in enumerate(NOTETYPE):
        #print index
        w, h = note.shape[::-1]
        #print img.shape

        res = cv2.matchTemplate(original, note, cv2.TM_CCOEFF_NORMED)

        note = note.copy()
        #cv2.line(note, (0, h/2), (w, h/2), (0 , 0, 0))
        cv2.imwrite('affined'+ str(index) + '.png', note)
        loc = np.where(res >= THRESHOLD)

        for pt in zip(*loc[::-1]):
            #print index, pt
            symbols[pt[0]][pt[1]]["noteType"] = index
            bottom, top = __removeDetected(original, pt[1], pt[0], w, h)

            symbols[pt[0]][pt[1]]["bottom"] = bottom
            symbols[pt[0]][pt[1]]["top"] = top
            cv2.rectangle(marked, pt, (pt[0] + w, pt[1] + h), COLOR[index], 1)


    return symbols

def main():
    normal = sys.argv[1].split(',')
    half = sys.argv[2].split(',')
    whole = sys.argv[3].split(',')

    img = cv2.imread('./public/sheet_without_staves.png', 0)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    symbol_range = img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])]
    cv2.imwrite('blrgh.png', symbol_range)
    NOTETYPE.append(img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])])
    NOTETYPE.append(img[int(half[1]):int(half[3]), int(half[0]):int(half[2])])
    NOTETYPE.append(img[int(whole[1]):int(whole[3]), int(whole[0]):int(whole[2])])
    symbols = detectSymbols(img, img_rgb)

    w, h = img.shape[::-1]

    cv2.imwrite('./public/image_after_process.png', img)
    cv2.imwrite('./public/image_marked.png', img_rgb)
main()
#symbols = sorted(symbols.iterkeys())
