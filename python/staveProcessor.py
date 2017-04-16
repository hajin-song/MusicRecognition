import cv2
import numpy as np
import scipy.misc
from collections import defaultdict

def __isStaveRow(np_array):
    bCount = np.bincount(np_array)
    #ii = np.nonzero(bCount)[0]
    #print bCount
    if sum(bCount[0:120]) >= len(np_array)/2:
        #print "TRUE"
        return True
    return False

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

    stave_groups = defaultdict(dict)
    stave_group_count = 0
    staves_so_far = 0
    stave_group = []
    for row_index, row in enumerate(img_np):
        if __isStaveRow(row):
            for index, cell in np.ndenumerate(img_np[row_index]):
                if img_np[row_index-1][index] > 140 and img_np[row_index+1][index] > 140:
                    img_np[row_index][index] = 255
            stave_group.append(row_index)
            staves_so_far += 1
            if staves_so_far % 5 == 0:
                staves_so_far = 0
                stave_groups[stave_group_count]["staves"] = stave_group
                stave_group = []
                stave_group_count += 1
    setStaveRange(stave_groups)
    return img_np, stave_groups
