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
        if cell <= 140:
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
    #print img_as_np[row_index - 1]
    img_as_np[row_index] = 255
    stave_type = 0
    #print row_index, stave_type
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
            if stave_as_np[row_index-1][cell_index] > 200:
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

def cropStaves(img_name = "../images/gs.jpg"):
    try:
        img = cv2.imread(img_name)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        img = cv2.imread(img_name)

    img_np = np.asarray(img)
    img_np_stave = img_np.copy()
    for row in img_np_stave:
        whites = row > 200
        blacks = row <= 200
        #print row
        #print whites
        row[whites] = 255
        row[blacks] = 0
    cv2.imwrite('res3.png', img_np_stave)
    w, h = img_np_stave.shape
    stave_factors = {}
    print img_np_stave.shape

    stave_groups = defaultdict(dict)
    current_stave_group = 0
    stave= {}
    stave['rows'] = []

    stave_group = {}
    stave_group['staves'] = []
    for row_index, row in enumerate(img_np_stave):
        stave_factors[row_index] = {}
        blacks, consecutive, segments = __calculateStaveFactor(row)
        stave_factors[row_index]['blacks'] = blacks
        stave_factors[row_index]['consecutive'] = consecutive
        stave_factors[row_index]['segments'] = segments
        factor = __isStave(blacks, consecutive, segments, w)
        stave_factors[row_index]['factor'] = factor
        if factor > 0.01:
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
        #print row_index, stave_factors[row_index]['factor']
    #print stave_factors
    print stave_groups
    return img_np, stave_groups
