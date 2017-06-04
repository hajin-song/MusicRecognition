""" RowProcessor.py: Processes row
"""
__author__ = "Ha Jin Song"
__date__   = "05-June-2017"

import numpy as np

from Momr.OMR.constants import *
import Momr.OMR.Traverser as Traverser
from Momr.Objects.Stave import Stave

def __calculateStaveFactor(row):
    """ calculate the stave factor of that row
        @param row: row being processed
        @returns: number of black dots, longest chain of black dots and segments
        @rtype: three numbers
    """
    blacks = 0 # number of black dots in the row
    longest_chain = 0 # longest consecutive black dots
    current_chain = 0 # current consecutvie black dots counting
    segments = 0  # number of breaks in between the chains
    for cell in row:
        if cell <= COLOR_THRSHOLD_BLACK:
            current_chain += 1
            blacks += 1
        else:
            if current_chain >= len(row)/10:
                segments += 1
            if current_chain > longest_chain:
                longest_chain = current_chain
            current_chain = 0
    return blacks, longest_chain, segments

def calculateStaveFactor(row):
    """ calculate the stave factor of that row
        @param row: row being processed
        @returns: stave factor
        @rtype: number
    """
    blacks, longest_chain, segments = __calculateStaveFactor(row)
    intRowLength = len(row) * 1.0
    return (blacks/intRowLength) * (longest_chain/intRowLength) / (segments+1)

def removeStaveRow(img, staves):
    """ removes the stave row of the image
        @param img: source image
        @param staves: staves in the image
    """

    for stave in staves:
        # a stave line can span over multiple rows
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
                    if img[row-1][index] > COLOR_THRSHOLD_BLACK and img[row+1][index] > COLOR_THRSHOLD_BLACK:
                        img[row][index] = COLOR_WHITE

            for index, cell in np.ndenumerate(img[stave[last]]):
                if img[stave[last]+1][index] > COLOR_THRSHOLD_BLACK:
                    img[stave[last]][index] = COLOR_WHITE
