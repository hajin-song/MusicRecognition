import cv2
import numpy as np

PUBLIC_PATH = "./public/"

def openImage(sessionId, fileName):
    imgName = "./public/" + sessionId + "/" + fileName
    try:
        img = cv2.imread(imgName)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        img = cv2.imread(imgName)
    return img

def saveImage(session_id, file_name, image):
    cv2.imwrite("./public/" + session_id + "/" + file_name, image)
