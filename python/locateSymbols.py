import sys
import cv2
import numpy as np
import json

from collections import defaultdict

from Momr.OMR import TemplateProcessor
from Momr.OMR import TailDetector
from Momr.Tool import Image

NOTETYPE = []
COLOR = [(255,0,0), (0, 255, 0), (0, 0, 255),  (0, 255,255), (255, 0, 255), (120, 120, 120), (90, 180, 120), (10, 10, 10) ]
THRESHOLD = 0.7

def locate_symbols():
    detected_symbols = {}

    normal = sys.argv[1].split(',')
    half = sys.argv[2].split(',')
    whole = sys.argv[3].split(',')
    flat = sys.argv[4].split(',')
    sharp = sys.argv[5].split(',')

    session_id = sys.argv[6]
    file_name = sys.argv[7]

    img = Image.openImage(session_id, file_name)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    img = np.asarray(img)
    img_copy = img.copy()
    img_rgb = np.asarray(img_rgb)

    NOTETYPE.append(img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])].copy())
    NOTETYPE.append(img[int(half[1]):int(half[3]), int(half[0]):int(half[2])].copy())
    NOTETYPE.append(img[int(whole[1]):int(whole[3]), int(whole[0]):int(whole[2])].copy())
    NOTETYPE.append(img[int(flat[1]):int(flat[3]), int(flat[0]):int(flat[2])].copy())
    NOTETYPE.append(img[int(sharp[1]):int(sharp[3]), int(sharp[0]):int(sharp[2])].copy())

    for index, note in enumerate(NOTETYPE):
        symbols = TemplateProcessor.detect_symbols(img, img_rgb, note, COLOR[index])
        w, h = note.shape[::-1]
        for x in symbols.keys():
            for y in symbols[x].keys():
                x_int = int(x)
                y_int = int(y)
                symbols[x][y]['type'] = index
                if index < 2:
                    print index
                    tail_type, tail_x, tail_y = TailDetector.find_tail_direction(img_copy, x_int, y_int, w, h, img_rgb)
                    symbols[x][y]['tail_direction'] = tail_type
                    symbols[x][y]['tail_x'] = tail_x
                    symbols[x][y]['tail_y'] = tail_y
                    TailDetector.find_tail_type(img_copy, tail_type, tail_x, tail_y, x_int, y_int, w, h, img_rgb)
                    #cv2.rectangle(img_rgb, (tail_x, tail_y), (tail_x + 1, tail_y + 1),  (255, 0, 255), 1)
                    #cv2.rectangle(img_rgb, (x_int, y_int), (x_int + w, y_int + h),  (0, 255, 255), 1)

                    if tail_type == 1:
                        cv2.rectangle(img_rgb, (x_int, y_int), (x_int + 10, y_int + 10),  (255, 0, 0), 1)
                    else:
                        cv2.rectangle(img_rgb, (x_int, y_int), (x_int + 10, y_int + 10),  (0, 255, 255), 1)
        detected_symbols.update(symbols)


    Image.saveImage(session_id, "image_marked.png", img_rgb)
    Image.saveImage(session_id, "image_after_process.png", img)
    #print detected_symbols
    #print symbols
    #for x in detected_symbols.keys():
    #    print x, "   ", detected_symbols[x]
    return detected_symbols

print json.dumps(locate_symbols())
