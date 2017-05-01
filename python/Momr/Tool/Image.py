import cv2
import numpy as np

PUBLIC_PATH = "./public/"

def open_image(session_id, file_name):
    img_name = "./public/" + session_id + "/" + file_name
    try:
        img = cv2.imread(img_name)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    except:
        img = cv2.imread(img_name)
    return img

def save_image(session_id, file_name, image):
    cv2.imwrite("./public/" + session_id + "/" + file_name, image)
