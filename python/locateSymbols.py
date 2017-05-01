import sys
import cv2
import numpy as np
import noteProcessor
from collections import defaultdict

from Momr.OMR import TemplateProcessor
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
    img_rgb = np.asarray(img_rgb)
    
    NOTETYPE.append(img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])].copy())
    NOTETYPE.append(img[int(half[1]):int(half[3]), int(half[0]):int(half[2])].copy())
    NOTETYPE.append(img[int(whole[1]):int(whole[3]), int(whole[0]):int(whole[2])].copy())

    for index, note in enumerate(NOTETYPE):
        symbols = TemplateProcessor.detect_symbols(img, img_rgb, note, COLOR[index])
        detected_symbols.update(symbols)

    Image.save_image(session_id, "image_marked.png", img_rgb)
    Image.save_image(session_id, "image_after_process.png", img)
    return detected_symbols

locate_symbols()
#symbols = sorted(symbols.iterkeys())
