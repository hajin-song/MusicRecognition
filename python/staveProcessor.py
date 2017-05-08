import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict

from Momr.OMR import RowProcessor
from Momr.Tool import Image

def __remove_duplicates(dictList, key):
    seen = []
    print len(dictList)
    for index, obj in enumerate(dictList):
        current = dictList[index]
        if current[key] in seen:
            print "DELETER", current[key]
            del dictList[index]
        else:
            print "DELETER START", current[key]
            seen.append(current[key])
    print len(dictList)
    return dictList
    
def __processRow(img, row_index, test):
    #print row_index
    row = img[row_index]
    #print row_index
    dictSeparators = RowProcessor.findSeparators(img, row_index, test)
    dictRowFactor = {}
    dictRowFactor['factor'] = RowProcessor.calculateStaveFactor(row)
    dictRowFactor['is_stave'] = False if dictRowFactor['factor'] <= 0.05 else True
    return dictRowFactor, dictSeparators

def cropStaves():
    sessionId = sys.argv[1]
    FieldName = sys.argv[2]

    img = Image.openImage(sessionId, FieldName)
    imgColor = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    npImg = np.asarray(img)

    w, h = npImg.shape

    dictStaveFactors = {}
    lstSeparators = []
    intSeparatorHeight = 0
    print len(npImg)
    # First Pass - gets rows that are inherently stave
    for index, row in enumerate(npImg):
        dictStaveFactors[index], dictSepResult = __processRow(npImg, index, imgColor)
        if intSeparatorHeight <= dictSepResult["height"]:
            intSeparatorHeight = dictSepResult["height"]
            for index, existingSeparator in enumerate(lstSeparators):
                if existingSeparator["height"] < intSeparatorHeight/2:
                    del lstSeparators[index]
            lstSeparators.append(dictSepResult)

    print len(lstSeparators)
    lstSeparators = __remove_duplicates(lstSeparators, "separators")
    print len(lstSeparators)
    #for sep in lstSeparators:
    #    print sep["height"], "  -   ", sep["separators"]
    #print lstSeparators
    # Second Pass - checks if rows near the staves should be staves
    for row in dictStaveFactors:
        curRow = dictStaveFactors[row]
        #print current_row
        if row == 0 or curRow['is_stave'] or row == len(dictStaveFactors.keys()) - 1: continue
        prevRow = dictStaveFactors[row - 1]
        nextRow = dictStaveFactors[row + 1]
        if prevRow['is_stave'] and nextRow['is_stave']:
            curRow['is_stave'] = True
        elif prevRow['is_stave'] or nextRow['is_stave']:
            if (curRow['factor']) > 0.01:
                curRow['is_stave'] = True

    lstStave= []
    lstStaveGroup = []
    lstStaveGroups = defaultdict(dict)
    countStaveGroup = 0

    for row in dictStaveFactors:
        if dictStaveFactors[row]['is_stave']:
            lstStave.append(row)
        else:
            if len(lstStave) > 0:
                lstStaveGroup.append(lstStave)
                lstStave = []
                if(len(lstStaveGroup) == 5):
                    lstStaveGroups[countStaveGroup] = lstStaveGroup
                    lstStaveGroup = []
                    countStaveGroup += 1


    for staveGroup in lstStaveGroups:
        RowProcessor.removeStaveRow(npImg, lstStaveGroups[staveGroup])

    Image.saveImage(sessionId, "sheet_without_staves.png", npImg)
    Image.saveImage(sessionId, "testerrr.png", imgColor)
    return npImg, lstStaveGroups

cropStaves()
