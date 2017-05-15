import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict
import json
import pickle

from Momr.Objects.Stave import Stave

from Momr.OMR import RowProcessor
from Momr.Tool import Image

def __RemoveDuplicateSections(staveGroups):
    result = []
    for staveGroup in staveGroups:
        if staveGroup not in result:
            result.append(staveGroup)
        else:
            index = result.index(staveGroup)
            target = result[index]
            if staveGroup.isSuperSet(target) == 1:
                result[index] = staveGroup

    return result


def __processRow(img, row_index, test):
    #print row_index
    row = img[row_index]
    #print row_index
    staveLine = {}
    staveLine["staveFactor"] = RowProcessor.calculateStaveFactor(row)
    staveLine['isStave'] = False
    return staveLine

def __bundleStaves(dictStaveFactors, avgStaveDistance):
    lstStave= []
    dictStaveGroup = { "stave": [] }
    dictStaveGroups = defaultdict(dict)

    countStaveGroup = 0
    staveRows = []
    for index, row in enumerate(dictStaveFactors.keys()):
        if dictStaveFactors[row]['isStave']:
            lstStave.append(row)
        else:
            if len(lstStave) > 0:
                staveRows.append(lstStave)
                lstStave = []
    prev = 0
    for stave in staveRows:
        first = stave[0]
        last = stave[-1]
        if len(dictStaveGroups[countStaveGroup]) == 0:
            dictStaveGroups[countStaveGroup] = [stave]
            prev = stave[-1]
        else:
            if first - prev <= avgStaveDistance * 2:
                dictStaveGroups[countStaveGroup].append(stave)
                prev = last
                if len(dictStaveGroups[countStaveGroup]) == 5:
                    countStaveGroup += 1
            else:
                dictStaveGroups[countStaveGroup] = [stave]
                prev = stave[-1]

    staves = []

    for staveGroup in dictStaveGroups:
        current = dictStaveGroups[staveGroup]
        y0 = current[0][-1]
        y1 = current[-1][-1]
        staves.append(Stave(y0, y1, current))

    return staves

def __findSectionDividers(img, staves):
    h, w = img.shape

    for stave in staves:
        y0 = stave.y0
        y1 = stave.y1
        for x in range(0, w):
            if all(img[y0:y1, x:x+1] <= 200) and img[y0:y1, x:x+1][0] <= 200:
                img[y0:y1, x:x+1] = 255
                stave.sections.append(x)
    return


def cropStaves():
    sessionId = sys.argv[1]
    FieldName = sys.argv[2]

    img = Image.openImage(sessionId, FieldName)
    ret,img = cv2.threshold(img, 200, 255,cv2.THRESH_BINARY)
    imgColor = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    npImg = np.asarray(img)
    npImgStaveMarked = np.asarray(imgColor.copy())

    h, w = npImg.shape

    dictStaveFactors = {}
    avgStaveFactor = 0.0

    # Go through lien and get features related to stave
    for index, row in enumerate(npImg):
        staveLine = __processRow(npImg, index, imgColor)
        avgStaveFactor += staveLine['staveFactor']
        #cv2.rectangle(imgColor, (0, y0), (section, y1),  (r, g, b), 1)
        dictStaveFactors[index] = staveLine

    # Get average feature score
    avgStaveFactor /= (index + 1)

    # Consider a rogue line - they should be skipped
    # A rogue line is defined as a line that can be stave but too far away from
    # the nearby stave groups
    avgStaveDistance = 0.0
    curDistance = 0
    staveCount = 0

    # First pass - check if a line is a stave based on the feature score
    for row in dictStaveFactors:
        curDistance += 1
        if (dictStaveFactors[row]['staveFactor']) > avgStaveFactor:
            dictStaveFactors[row]['isStave'] = True
            avgStaveDistance += curDistance
            curDistance = 0
            staveCount += 1


    avgStaveDistance /= staveCount

    # Second pass - check if a line is sandwiched between two staves
    for row in dictStaveFactors.keys()[1:-1]:
        prevRow = dictStaveFactors[row - 1]
        nextRow = dictStaveFactors[row + 1]
        if dictStaveFactors[row]['isStave']: continue
        elif prevRow['isStave'] and nextRow['isStave']:
            dictStaveFactors[row]['isStave'] = True

    # Bundle the staves as group
    staves = __bundleStaves(dictStaveFactors, avgStaveDistance)

    # Find the dividers at each stave group
    __findSectionDividers(npImg, staves)

    for stave in staves:
        y0 = stave.y0
        y1 = stave.y1
        for section in stave.sections:
            cv2.rectangle(npImgStaveMarked, (section, y0), (section, y1),  (0, 255, 255), 1)
        cv2.rectangle(npImgStaveMarked, (stave.sections[0], stave.lines[0][-1]), (stave.sections[-1], stave.lines[-1][-1]),  (0, 255, 255), 1)
        print stave.json()


    r = 255
    g = 0
    b = 255

    for staveGroup in staves:
        y0 = staveGroup.y0
        y1 = staveGroup.y1
        RowProcessor.removeStaveRow(npImg, staveGroup.lines)
        for stave in staveGroup.lines:
            for x in stave:
                cv2.rectangle(imgColor, (0, x), (w, x),  (r, g, b), 1)
        for section in staveGroup.sections:
            cv2.rectangle(imgColor, (section, y0), (section, y1),  (r, g, b), 1)



    output = open("./public/" + sessionId + "/" + "stave.pkl", "wb")
    Image.saveImage(sessionId, "sheet_without_staves.png", npImg)
    Image.saveImage(sessionId, "testerrr.png", imgColor)
    Image.saveImage(sessionId, "sheet_section_marked.png", npImgStaveMarked)
    pickle.dump(staves, output)


cropStaves()
