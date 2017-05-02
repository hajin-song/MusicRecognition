import sys
import cv2
import numpy as np

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

    session_id = sys.argv[4]
    file_name = sys.argv[5]

    img = Image.open_image(session_id, file_name)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    img = np.asarray(img)
    img_copy = img.copy()
    img_rgb = np.asarray(img_rgb)
    print normal
    print half
    print whole
    NOTETYPE.append(img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])].copy())
    NOTETYPE.append(img[int(half[1]):int(half[3]), int(half[0]):int(half[2])].copy())
    NOTETYPE.append(img[int(whole[1]):int(whole[3]), int(whole[0]):int(whole[2])].copy())

    print "?"
    print img.shape[::-1]
    for index, note in enumerate(NOTETYPE):
        symbols = TemplateProcessor.detect_symbols(img, img_rgb, note, COLOR[index])
        if index == 0:
            w, h = note.shape[::-1]
            for x in symbols.keys():
                for y in symbols[x].keys():
                    tail_type = TailDetector.find_tail_direction(img_copy, x, y, w, h, img_rgb)
                    print tail_type
                    if tail_type == 1:
                        cv2.rectangle(img_rgb, (x, y), (x + 1, y + 1),  (255, 0, 0), 1)
                    else:
                        cv2.rectangle(img_rgb, (x, y), (x + 1, y + 1),  (0, 0, 255), 1)
        detected_symbols.update(symbols)

    print detected_symbols

    Image.save_image(session_id, "image_marked.png", img_rgb)
    Image.save_image(session_id, "image_after_process.png", img)

locate_symbols()
#symbols = sorted(symbols.iterkeys())
