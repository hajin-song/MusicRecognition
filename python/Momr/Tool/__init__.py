import cv2
import numpy as np

PUBLIC_PATH = "./public/"

def openImage(session_token, file_name):
    image_name = PUBLIC_PATH + session_token + "/" + file_name
    try:
        img = cv2.imread(img_name)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        img = cv2.imread(img_name)
    return np.asarray(img)
