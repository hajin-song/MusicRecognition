import sys
import cv2
import numpy as np
import pickle

from collections import defaultdict

from Momr.OMR import TemplateProcessor
from Momr.OMR import TailDetector
from Momr.Tool import Image
from Momr.Objects.Stave import Stave
from Momr.Objects.Note import Note

COLOR = [(255,0,0), (0, 255, 0), (0, 0, 255),  (0, 255,255), (255, 0, 255), (120, 120, 120), (90, 180, 120), (10, 10, 10) ]
THRESHOLD = 0.7

def __check_coliision(x0, y0, x1, y1, w, h):
    target_corners = [x0, x0+w, y0, y0+h]
    new_points = [(x1,y1), (x1+w, y1), (x1, y1+h), (x1+w, y1+h)]
    for point in new_points:
        if target_corners[0] <= point[0] and point[0] <= target_corners[1]:
            if target_corners[2] <= point[1] and point[1] <= target_corners[3]:
                return True
    #print target_corners, x1, y1, w, h
    return False


def __match_template(image, templates, test, test_color):
    """ Perform template matching on an image using the given symbols
        :param image: np array. Representation of image being templated
        :param templates: np array. Collection of coordinate for symbols
        :param test: DEBUG - used to mark the detected region
        :param test_color: DEBUG - color used to mark the detected region
    """
    detected_symbols = []
    for index, note in enumerate(templates):
        if note is None: continue
        symbols = TemplateProcessor.detect_symbols(image, test, note, test_color[index])
        w, h = note.shape[::-1]
        if index == 2:
            color = (255, 0, 255)
        elif index == 3:
            color = (0, 255, 0)
        else:
            color = (0, 0, 255)
        for x in symbols.keys():
            for y in symbols[x].keys():
                x = int(x)
                y = int(y)
                # Check if current region collide with previous detected regions
                not_in = True
                for symbol in detected_symbols:
                    if __check_coliision(symbol.x, symbol.y, x, y, w, h):
                        not_in = False
                        break
                if not_in:
                    first = -1
                    last = -1
                    for y_val in range(y, y + h):
                        retVal, temp = cv2.threshold(image[y_val][x:x+w], 200, 255, cv2.THRESH_BINARY)
                        whites = cv2.countNonZero(temp)
                        if whites <= w/2:
                            if first == -1: first = y_val + 1
                            else: last = y_val
                    cv2.rectangle(test, (x, y), (x + 15, y + 15), color, 1)
                    detected_symbols.append(Note(x, y, index, w, h, first, last))
    return detected_symbols

def __process_tail_direction(detected_symbols, image, test):
    """ Detect tail's direction
        :param detected_symbols: List of Notes. Detected notes
        :param image: Target Image
        :param test: DEBUG - used to mark the detected region
    """
    for symbol in detected_symbols:
        x = symbol.x
        y = symbol.y
        w = symbol.w
        h = symbol.h
        note_type = symbol.note_type

        tail_type, tail_x, tail_y = TailDetector.find_tail_direction(image, x, y, w, h, test)
        symbol.tail_direction = tail_type
        symbol.tail_x = tail_x
        symbol.tail_y = tail_y
    return detected_symbols

def __allocate_note_to_stave(staves, detected_symbols):
    """ Allocates notes to appropriate stave group based on the x and y value
        :param staves: Stave groups within the sheet
        :param detected_symbols: List of Notes that needs to be allocated
    """
    for symbol in detected_symbols:
        symbol_x = symbol.x
        symbol_y = symbol.y
        tail_direction = symbol.tail_direction
        current = staves[0]
        for stave in staves[1:]:
            stave_0_y_0 = current.y0
            stave_0_y_1 = current.y1
            stave_1_y_0 = stave.y0
            stave_1_y_1 = stave.y1
            #print symbol_x, symbol_y, stave_0_y_0, stave_0_y_1, stave_1_y_0, stave_1_y_1
            if symbol_y <= stave_0_y_1:
                break
            elif symbol_y > stave_0_y_1 and symbol_y < stave_1_y_0:
                if tail_direction == 0:
                    break
                else:
                    current = stave
                    break
            current = stave

        for index, stave_x_0 in enumerate(current.sections[:-1]):
            stave_x_1 = current.sections[index+1]
            if stave_x_0 <= symbol_x and symbol_x <= stave_x_1:
                break

        current.addNote(str(stave_x_0), symbol)

def __process_tail_type(staves, image, test):
    """ traverse through image pixel and categorise the symbol's tail type
        :param staves: stave groups with note allocated
        :param image: source image
        :param test: DEBUG - used to mark the detected region
    """

    for stave in staves:
        #stave.notes = sorted(stave.notes, key=lambda x: int(x))
        sorted_section = sorted(stave.notes, key=lambda x: int(x))
        for section_index, separator in enumerate(sorted_section):
            stave.notes[separator] = sorted(stave.notes[separator], key=lambda x: int(x.x))
            for index, note in enumerate(stave.notes[separator]):
                #print '\t\t', note, index
                if note.note_type > 1:
                    if index == (len(stave.notes[separator])-1):
                        next_note = note
                        prev_note =  stave.notes[separator][index - 1]
                    elif index == 0:
                        next_note = stave.notes[separator][index + 1]
                        prev_note = note
                    else:
                        prev_note = stave.notes[separator][index - 1]
                        next_note = stave.notes[separator][index + 1]
                    tail_type, is_bar = TailDetector.find_tail_type(image,
                    note, prev_note, next_note, test)
                    note.tail_type = tail_type
                    note.is_bar = is_bar

def __find_note_pitch(staves, test):
    for stave in staves:
        y0 = stave.y0
        y1 = stave.y1
        #print stave
        for section in stave.notes:
            #print '\t', section
            for note in stave.notes[section]:
                note_y = note.center()[1]
                top = note.top_y
                bottom = note.bottom_y
                # Origin is top left corner
                rev_staveline = stave.lines[::-1]
                for index, line in enumerate(rev_staveline):
                    # Note is above the stave lines
                    if index == (len(stave.lines) - 1):
                        average_distance = stave.averageDistane()
                        pitchVar = index * 2
                        note_y = abs(line[-1] - note_y)
                        while(note_y >= 0):
                            pitchVar += 1
                            note_y -= average_distance
                        break
                    # Note is below the stave lines
                    elif index == 0 and note_y > line[-1]:
                        average_distance = stave.averageDistane()
                        pitchVar = 0
                        note_y = abs(line[-1] - note_y)
                        while(note_y >= 0):
                            pitchVar -= 1
                            note_y -= average_distance
                        break
                    else:
                        bottom_stave = line[-1]
                        top_stave = rev_staveline[index+1][-1]
                        if bottom >= bottom_stave:
                            pitchVar = index * 2
                            break
                        elif bottom < bottom_stave and top > top_stave:
                            pitchVar = index * 2 + 1
                            break
                note.setPitch(pitchVar + 2)


def locate_symbols():
    detected_symbols = {}
    note_type = []

    # load current session's target file
    session_id = sys.argv[11]
    file_name = sys.argv[12]

    img = Image.openImage(session_id, file_name)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    img = np.asarray(img)
    img_copy = img.copy()
    img_rgb = np.asarray(img_rgb)

    # Load template image coordinates
    normal = sys.argv[1].split(',')
    half = sys.argv[2].split(',')
    whole = sys.argv[3].split(',')
    normal_rest = sys.argv[4].split(',')
    half_rest = sys.argv[5].split(',')
    quaver_rest = sys.argv[6].split(',')
    semi_quaver_rest = sys.argv[7].split(',')
    demi_semi_quaver_rest = sys.argv[8].split(',')
    flat = sys.argv[9].split(',')
    sharp = sys.argv[10].split(',')

    if int(flat[0]) != -1: note_type.append(img[int(flat[1]):int(flat[3]), int(flat[0]):int(flat[2])].copy())
    else: note_type.append(None)

    if int(sharp[0]) != -1: note_type.append(img[int(sharp[1]):int(sharp[3]), int(sharp[0]):int(sharp[2])].copy())
    else: note_type.append(None)

    if int(half[0]) != -1: note_type.append(img[int(half[1]):int(half[3]), int(half[0]):int(half[2])].copy())
    else: note_type.append(None)

    if int(whole[0]) != -1: note_type.append(img[int(whole[1]):int(whole[3]), int(whole[0]):int(whole[2])].copy())
    else: note_type.append(None)

    if int(normal[0]) != -1: note_type.append(img[int(normal[1]):int(normal[3]), int(normal[0]):int(normal[2])].copy())
    else: note_type.append(None)

    if int(normal_rest[0]) != -1: note_type.append(img[int(normal_rest[1]):int(normal_rest[3]), int(normal_rest[0]):int(normal_rest[2])].copy())
    else: note_type.append(None)

    if int(half_rest[0]) != -1: note_type.append(img[int(half_rest[1]):int(half_rest[3]), int(half_rest[0]):int(half_rest[2])].copy())
    else: note_type.append(None)

    if int(quaver_rest[0]) != -1: note_type.append(img[int(quaver_rest[1]):int(quaver_rest[3]), int(quaver_rest[0]):int(quaver_rest[2])].copy())
    else: note_type.append(None)

    if int(semi_quaver_rest[0]) != -1: note_type.append(img[int(semi_quaver_rest[1]):int(semi_quaver_rest[3]), int(semi_quaver_rest[0]):int(semi_quaver_rest[2])].copy())
    else: note_type.append(None)

    if int(demi_semi_quaver_rest[0]) != -1: note_type.append(img[int(demi_semi_quaver_rest[1]):int(demi_semi_quaver_rest[3]), int(demi_semi_quaver_rest[0]):int(demi_semi_quaver_rest[2])].copy())
    else: note_type.append(None)
    # load stave group information from pickle
    pkl_file = open('./public/' + session_id + '/' + 'stave.pkl')
    staves = pickle.load(pkl_file)

    detected_symbols = __match_template(img, note_type, img_rgb, COLOR)
    detected_symbols = __process_tail_direction(detected_symbols, img, img_rgb)
    __allocate_note_to_stave(staves, detected_symbols)
    __process_tail_type(staves, img, img_rgb)
    __find_note_pitch(staves, img_rgb)

    for stave in staves:
        print stave.json()
    Image.saveImage(session_id, "image_marked.png", img_rgb)
    Image.saveImage(session_id, "image_after_process.png", img)
        #print symbol_x, symbol_y
    #return detected_symbols

locate_symbols()
