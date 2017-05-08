import sys
import cv2
import numpy as np
import scipy.misc
from collections import defaultdict

from Momr.OMR.constants import *
import Momr.OMR.Traverser as Traverser

def findSeparators(img, rowIndex, imgColr):
    intMaxUpCount = 0
    intMaxDownCount = 0
    separators = []
    for x, cell in enumerate(img[rowIndex]):
        #print x, rowIndex, "findSeparator, line 12"
        intUpCount = Traverser.upTraverse(img, x, rowIndex, imgColr)
        intDownCount = Traverser.downTraverse(img, x, rowIndex, imgColr)
        if(intMaxUpCount < intUpCount and intMaxDownCount < intDownCount):
            separators = [x]
            intMaxUpCount = intUpCount
            intMaxDownCount = intDownCount
        elif(intMaxUpCount == intUpCount and intMaxDownCount == intDownCount):
            separators.append(x)
        else:
            continue
    #print separators, intMaxUpCount, intMaxDownCount
    return { "separators": separators, "x_0": intMaxUpCount, "x_1": intMaxDownCount, "height": abs(intMaxDownCount) + abs(intMaxUpCount) }

def __calculateStaveFactor(row):
    intBlacks = 0
    intLongestChain = 0
    intCurrentChain = 0
    intSegments = 0
    for cell in row:
        if cell <= COLOR_THRSHOLD_BLACK:
            intCurrentChain += 1
            intBlacks += 1
        else:
            if intCurrentChain >= len(row)/10:
                intSegments += 1
            if intCurrentChain > intLongestChain:
                intLongestChain = intCurrentChain
            intCurrentChain = 0
    return intBlacks, intLongestChain, intSegments

def calculateStaveFactor(row):
    intBlacks, intLongestChain, intSegments = __calculateStaveFactor(row)
    intRowLength = len(row) * 1.0
    return (intBlacks/intRowLength) * (intLongestChain/intRowLength) / (intSegments+1)


def removeStaveRow(img, staves):
    for stave in staves:
        if len(stave) == 1:
            for index, cell in np.ndenumerate(img[stave[0]]):
                if img[stave[0]-1][index] > COLOR_THRSHOLD_BLACK and img[stave[0]+1][index] > COLOR_THRSHOLD_BLACK:
                    img[stave[0]][index] = COLOR_WHITE
        else:
            first = 0
            last = len(stave) - 1
            for index, cell in np.ndenumerate(img[stave[0]]):
                if img[stave[0]-1][index] > COLOR_THRSHOLD_BLACK:
                    img[stave[0]][index] = COLOR_WHITE

            for row in stave[1:-1]:
                for index, cell in np.ndenumerate(img[row]):
                    if img[row_index-1][index] > COLOR_THRSHOLD_BLACK and img[row_index+1][index] > COLOR_THRSHOLD_BLACK:
                        img[row_index][index] = COLOR_WHITE

            for index, cell in np.ndenumerate(img[stave[last]]):
                if img[stave[last]+1][index] > COLOR_THRSHOLD_BLACK:
                    img[stave[last]][index] = COLOR_WHITE
