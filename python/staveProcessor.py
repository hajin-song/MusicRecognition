import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict

def __calculateStaveFactor(np_array):
    blacks = 0
    longest_chain = 0
    current_chain = 0
    segments = 0
    for cell in np_array:
        if cell <= 200:
            current_chain += 1
            blacks += 1
        else:
            if current_chain >= len(np_array)/10:
                segments += 1
            if current_chain > longest_chain:
                longest_chain = current_chain
            current_chain = 0
    return blacks, longest_chain, segments

def __isStave(blacks, longest_chain, segments, row_length):
    row_length_float = row_length * 1.0
    return (blacks/row_length_float) * (longest_chain/row_length_float) / (segments+1)


def __whiteOutRow(img_as_np, stave_as_np, row_index, stave_type = 0):
    if stave_type == 3:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > 200 and stave_as_np[row_index+1][cell_index] > 200:
                img_as_np[row_index][cell_index] = 255
    elif stave_type == 1:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > 200:
                img_as_np[row_index][cell_index] = 255
    elif stave_type == 2:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index+1][cell_index] > 200:
                img_as_np[row_index][cell_index] = 255
    else:
        for cell_index, cell in np.ndenumerate(stave_as_np[row_index]):
            if stave_as_np[row_index-1][cell_index] > 200 and stave_as_np[row_index+1][cell_index] > 200:
                img_as_np[row_index][cell_index] = 255


def setStaveRange(staveGroups):
    first_group = min(staveGroups.keys())
    last_group = max(staveGroups.keys())

    for staveGroup in staveGroups:
        prev_group_index = 0 if staveGroup == staveGroup else staveGroup - 1
        next_group_index = staveGroup if staveGroup == last_group else staveGroup + 1
        current = staveGroups[staveGroup]
        if(staveGroup == first_group):
            current["highest"] = -1
            current["lowest"] = max(current["staves"]) + abs(max(current["staves"]) - min(staveGroups[staveGroup+1]["staves"]))/2
        elif(staveGroup == last_group):
            current["lowest"] = -1
            current["highest"] = min(current["staves"]) - abs(min(current["staves"]) - max(staveGroups[staveGroup-1]["staves"]))/2
        else:
            current["lowest"] = max(current["staves"]) + abs(max(current["staves"]) - min(staveGroups[staveGroup+1]["staves"]))/2
            current["highest"] = min(current["staves"]) - abs(min(current["staves"]) - max(staveGroups[staveGroup-1]["staves"]))/2

def cropStaves():
    file_name = sys.argv[1]
    img_name = "./images/" + file_name

    try:
        img = cv2.imread(img_name)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        img = cv2.imread(img_name)

    img_np = np.asarray(img)

    for row in img_np:
        whites = row > 200
        black = row <= 200
        row[black] = 0
        row[whites] = 255

    w, h = img_np.shape

    stave_factors = {}

    stave_groups = defaultdict(dict)
    current_stave_group = 0

    stave= {}
    stave['rows'] = []

    stave_group = {}
    stave_group['staves'] = []
    for row_index, row in enumerate(img_np):
        stave_factors[row_index] = {}
        blacks, consecutive, segments = __calculateStaveFactor(row)
        stave_factors[row_index]['blacks'] = blacks
        stave_factors[row_index]['consecutive'] = consecutive
        stave_factors[row_index]['segments'] = segments
        factor = __isStave(blacks, consecutive, segments, w)
        stave_factors[row_index]['factor'] = factor
        stave_factors[row_index]['is_stave'] = False
        if factor > 0.05:
            stave_factors[row_index]['is_stave'] = True

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

    for row_index, row in enumerate(img_np):
        if stave_factors[row_index]['is_stave']:
            stave['rows'].append(row_index)
        else:
            if len(stave['rows']) > 0:
                stave_group['staves'].append(stave)
                stave= {}
                stave['rows'] = []
                if(len(stave_group['staves']) == 5):
                    stave_groups[current_stave_group] = stave_group
                    stave_group = {}
                    stave_group['staves'] = []
                    current_stave_group += 1


    for stave_group in stave_groups:
        print stave_groups[stave_group]
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
                __whiteOutRow(img_np, img_np, row, stave_type)
        #print row_index, stave_factors[row_index]['factor']

    cv2.imwrite("./public/sheet_without_staves.png", img_np)
    print stave_groups
    return img_np, stave_groups

cropStaves()
