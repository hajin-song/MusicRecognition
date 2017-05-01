import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict

from Momr.OMR import StaveDetector
from Momr.Tool import Image

def cropStaves():
    session_id = sys.argv[1]
    file_name = sys.argv[2]

    img = Image.open_image(session_id, file_name)
    img_np = np.asarray(img)

    w, h = img_np.shape

    stave_factors = {}
    stave_groups = defaultdict(dict)
    current_stave_group = 0

    stave= {}
    stave['rows'] = []

    stave_group = {}
    stave_group['staves'] = []

    # First Pass - gets rows that are inherently stave
    for row_index, row in enumerate(img_np):
        stave_factors[row_index] = {}
        blacks, consecutive, segments = StaveDetector.calculate_stave_factor(row)
        stave_factors[row_index]['blacks'] = blacks
        stave_factors[row_index]['consecutive'] = consecutive
        stave_factors[row_index]['segments'] = segments
        factor = StaveDetector.is_stave(blacks, consecutive, segments, w)
        stave_factors[row_index]['factor'] = factor
        stave_factors[row_index]['is_stave'] = False
        if factor > 0.05:
            stave_factors[row_index]['is_stave'] = True

    # Second Pass - checks if rows near the staves should be staves
    for row_index, row in enumerate(img_np):
        current_row = stave_factors[row_index]
        if row_index == 0 or row_index == len(img_np) - 1 or current_row['is_stave']: continue
        prev_row = stave_factors[row_index - 1]
        next_row = stave_factors[row_index + 1]
        if prev_row['is_stave'] and next_row['is_stave']:
            current_row['is_stave'] = True
        elif prev_row['is_stave'] or next_row['is_stave']:
            if (current_row['factor']) > 0.01:
                current_row['is_stave'] = True

    # Third Pass - group stave rows into stave (multi-line staves)
    for row_index, row in enumerate(img_np):
        if stave_factors[row_index]['is_stave']:
            stave['rows'].append(row_index)
        else:
            if len(stave['rows']) > 0:
                stave_group['staves'].append(stave)
                stave= { 'rows': [] }
                if(len(stave_group['staves']) == 5):
                    stave_groups[current_stave_group] = stave_group
                    stave_group = { 'staves': [] }
                    current_stave_group += 1

    for stave_group in stave_groups:
        for stave in stave_groups[stave_group]['staves']:
            first = min(stave['rows'])
            last = max(stave['rows'])
            for row in stave['rows']:
                stave_type = 0
                if first == last:
                    stave_type = 3
                elif row == first:
                    stave_type = 1
                elif row == last:
                    stave_type = 2
                StaveDetector.remove_stave_row(img_np, img_np, row, stave_type)

    Image.save_image(session_id, "sheet_without_staves.png", img_np)
    return img_np, stave_groups

cropStaves()
