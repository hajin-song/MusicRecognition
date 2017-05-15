import sys
import json
import pickle

from Momr.Objects.Stave import Stave

def __updateStave(new_stave, fileName, sessionId):
    newStave = json.loads(data);
    pkl = open('./public/' + sessionId + '/' + fileName)
    staves = pickle.load(pkl)

    for stave in staves:
        if int(stave.y0) == newStave['y0'] and stave.y1 == newStave['y1']:
            stave.lines = newStave['lines']
            stavesections = newStave['sections']

    output = open("./public/" + sessionId + "/" + fileName, "wb")
    pickle.dump(staves, output)

def updateData():
    # sessionId = Unique string for user's session
    sessionId = sys.argv[2]
    # FileName = File to process
    fileName = sys.argv[3]
    data = sys.argv[1]
    
    if data=="stave.pkl":
        __updateStave(data, fileName, sessionId)

updateData();
