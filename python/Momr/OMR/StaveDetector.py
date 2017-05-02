import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
from Momr.OMR.constants import *

def calculate_stave_factor(np_array):
    blacks = 0
    longest_chain = 0
    current_chain = 0
    segments = 0
    for cell in np_array:
        if cell <= COLOR_THRSHOLD_BLACK:
            current_chain += 1
            blacks += 1
        else:
            if current_chain >= len(np_array)/10:
                segments += 1
            if current_chain > longest_chain:
                longest_chain = current_chain
            current_chain = 0
    return blacks, longest_chain, segments

def is_stave(blacks, longest_chain, segments, row_length):
    row_length_float = row_length * 1.0
    return (blacks/row_length_float) * (longest_chain/row_length_float) / (segments+1)


def remove_stave_row(img_as_np, stave_as_np, row_index, stave_type = 0):
    if stave_type == 3:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > COLOR_THRSHOLD_BLACK and stave_as_np[row_index+1][cell_index] > COLOR_THRSHOLD_BLACK:
                img_as_np[row_index][cell_index] = COLOR_WHITE
    elif stave_type == 1:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > COLOR_THRSHOLD_BLACK:
                img_as_np[row_index][cell_index] = COLOR_WHITE
    elif stave_type == 2:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index+1][cell_index] > COLOR_THRSHOLD_BLACK:
                img_as_np[row_index][cell_index] = COLOR_WHITE
    else:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > COLOR_THRSHOLD_BLACK and stave_as_np[row_index+1][cell_index] > COLOR_THRSHOLD_BLACK:
                img_as_np[row_index][cell_index] = COLOR_WHITE


def set_stave_range(stave_groups):
    first_group = min(stave_groups.keys())
    last_group = max(stave_groups.keys())

    for stave_group in stave_groups:
        prev_group_index = 0 if stave_group == stave_group else stave_group - 1
        next_group_index = stave_group if stave_group == last_group else stave_group + 1
        current = stave_groups[stave_group]
        if(stave_group == first_group):
            current["highest"] = -1
            current["lowest"] = max(current["staves"]) + abs(max(current["staves"]) - min(stave_groups[stave_group+1]["staves"]))/2
        elif(stave_group == last_group):
            current["lowest"] = -1
            current["highest"] = min(current["staves"]) - abs(min(current["staves"]) - max(stave_groups[stave_group-1]["staves"]))/2
        else:
            current["lowest"] = max(current["staves"]) + abs(max(current["staves"]) - min(stave_groups[stave_group+1]["staves"]))/2
            current["highest"] = min(current["staves"]) - abs(min(current["staves"]) - max(stave_groups[stave_group-1]["staves"]))/2
