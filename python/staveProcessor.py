""" staveProcessor.py: Processes image and detect stave lines and section
    diviers
"""
__author__ = "Ha Jin Song"
__date__   = "05-June-2017"

import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
import pickle

from Momr.Objects.Stave import Stave
from Momr.OMR.constants import *

from Momr.OMR import RowProcessor
from Momr.Tool import Image


def __processRow(img, row_index, test):
    """ Calculate Stave Factor of each row
        @param img: source image
        @param row_index: row number
        @param test: DEBUG - marked image
        @returns: stave factors of each line
        @rtype: dictionary representing each row of the image
    """
    stave_line = {}
    row = img[row_index]
    stave_line["staveFactor"] = RowProcessor.calculateStaveFactor(img[row_index])
    stave_line['isStave'] = False
    return stave_line

def __bundleStaves(dict_stave_factors, avg_stave_dist):
    """ Bundles each stave row in a group of 5
        @param dict_stave_factors: dictionary representing each row of image
        @param avg_stave_dist: Average distane between each stave lines
        @returns: list of stave object
        @rtype: List of Stave
    """
    lst_stave= []
    dict_stave_group = { "stave": [] }
    dict_stave_groups = defaultdict(dict)

    cnt_stave_group = 0

    # Look for multi-lien stave rows
    staveRows = []
    for index, row in enumerate(dict_stave_factors.keys()):
        if dict_stave_factors[row]['isStave']:
            lst_stave.append(row)
        else:
            if len(lst_stave) > 0:
                staveRows.append(lst_stave)
                lst_stave = []

    # keep track of previous stave line to check for threshold
    prev = 0
    for stave in staveRows:
        first = stave[0]
        last = stave[-1]
        if len(dict_stave_groups[cnt_stave_group]) == 0:
            dict_stave_groups[cnt_stave_group] = [stave]
            prev = stave[-1]
        else:
            if first - prev <= avg_stave_dist * 2:
                dict_stave_groups[cnt_stave_group].append(stave)
                prev = last
                if len(dict_stave_groups[cnt_stave_group]) == 5:
                    cnt_stave_group += 1
            else:
                dict_stave_groups[cnt_stave_group] = [stave]
                prev = stave[-1]

    staves = []

    # Set stave group height range
    for stave_group in dict_stave_groups:
        current = dict_stave_groups[stave_group]
        y0 = current[0][-1]
        y1 = current[-1][-1]
        staves.append(Stave(y0, y1, current))

    return staves

def __findSectionDividers(img, staves):
    """
    Find where the stave groups are separated on.
    By definition, a separator is a black line striking through the stave row
    vertically.
    Since note detections are not done at this stage, users can manually merge
    separators at Front end
        @param img: source image
        @param staves: staves in the image
    """
    h, w = img.shape

    prev = -1
    for stave in staves:
        y0 = stave.y0
        y1 = stave.y1
        for x in range(0, w):
            # is it a straight black line
            if all(img[y0:y1, x:x+1] <= COLOR_THRSHOLD_BLACK):
                if prev == -1 or abs(x-prev) > 80:
                    stave.sections.append(x)
                    prev = x

def cropStaves():
    """ main method for stave detector
    """
    # session_id = Unique string for user's session
    session_id = sys.argv[1]
    # file_name = File to process
    file_name = sys.argv[2]

    img = Image.openImage(session_id, file_name)

    # img_color used for debugging purposes
    img_color = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    np_img = np.asarray(img)
    np_img_stave_marked = np.asarray(img_color.copy())

    h, w = np_img.shape

    dict_stave_factors = {}
    avg_stave_factor = 0.0

    # Go through lien and get features related to stave
    for index, row in enumerate(np_img):
        stave_line = __processRow(np_img, index, img_color)
        avg_stave_factor += stave_line['staveFactor']
        #cv2.rectangle(img_color, (0, y0), (section, y1),  (r, g, b), 1)
        dict_stave_factors[index] = stave_line

    # Get average feature score
    avg_stave_factor /= (index + 1)

    # Consider a rogue line - they should be skipped
    # A rogue line is defined as a line that can be stave but too far away from
    # the nearby stave groups
    avg_stave_dist = 0.0
    cur_dist = 0
    stave_count = 0

    # First pass - check if a line is a stave based on the feature score
    for row in dict_stave_factors:
        cur_dist += 1
        if (dict_stave_factors[row]['staveFactor']) > avg_stave_factor:
            dict_stave_factors[row]['isStave'] = True
            avg_stave_dist += cur_dist
            cur_dist = 0
            stave_count += 1


    avg_stave_dist /= stave_count

    # Second pass - check if a line is sandwiched between two staves
    for row in dict_stave_factors.keys()[1:-1]:
        prev_row = dict_stave_factors[row - 1]
        next_row = dict_stave_factors[row + 1]
        if dict_stave_factors[row]['isStave']: continue
        elif prev_row['isStave'] and next_row['isStave']:
            dict_stave_factors[row]['isStave'] = True

    # Bundle the staves as group
    staves = __bundleStaves(dict_stave_factors, avg_stave_dist)

    # Find the dividers at each stave group
    __findSectionDividers(np_img, staves)

    for index, stave in enumerate(staves):
        if index == 0:
            distance = staves[index+1].y0 - stave.y1
            stave.true_y1 = stave.y1 + distance/2
            stave.true_y0 = stave.y0 - distance/2
            if stave.true_y0 < 0: stave.true_y0 = 0
        elif index == len(staves) -1:
            distance = stave.y0 - staves[index-1].y1
            stave.true_y1 = stave.y1 + distance/2
            stave.true_y0 = stave.y0 - distance/2
            if stave.true_y1 >= h: stave.true_y1 = h - 1
        else:
            distance_top =  stave.y0 - staves[index-1].y1
            distance_bot = staves[index+1].y0 - stave.y1
            stave.true_y1 = stave.y1 + distance_bot/2
            stave.true_y0 = stave.y0 - distance_top/2
            if stave.true_y0 < 0: stave.true_y0 = 0
            if stave.true_y1 >= h: stave.true_y1 = h - 1

    for stave in staves:
        y0 = stave.y0
        y1 = stave.y1
        for section in stave.sections:
            cv2.rectangle(np_img_stave_marked, (section, y0), (section, y1),  (0, 255, 255), 1)
        cv2.rectangle(np_img_stave_marked, (stave.sections[0], stave.lines[0][-1]), (stave.sections[-1], stave.lines[-1][-1]),  (0, 255, 255), 1)
        print stave.json()


    r = 255
    g = 0
    b = 255

    for stave_group in staves:
        y0 = stave_group.y0
        y1 = stave_group.y1
        RowProcessor.removeStaveRow(np_img, stave_group.lines)
        # debugging
        for stave in stave_group.lines:
            for x in stave:
                cv2.rectangle(img_color, (0, x), (w, x),  (r, g, b), 1)
        for section in stave_group.sections:
            cv2.rectangle(img_color, (section, y0), (section, y1),  (r, g, b), 1)



    output = open("./public/" + session_id + "/" + "stave.pkl", "wb")
    Image.saveImage(session_id, "sheet_without_staves.png", np_img)
    Image.saveImage(session_id, "testerrr.png", img_color)
    Image.saveImage(session_id, "sheet_section_marked.png", np_img_stave_marked)
    pickle.dump(staves, output)

cropStaves()
