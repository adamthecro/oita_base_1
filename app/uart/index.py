#Libraries
import atexit
import socketio
sio = socketio.Client()

import cv2
import numpy as np
import os
import base64
import json

#Libraries para pruebas
import random
from array import *

#Variables
connected = False
done = False
state = {
    "type":"001",
    "base":"0",
    "batt":"60",
    "charg":"0",
    "charg":"0",
    "lat":"0",
    "long":"0",
    "alt":"0",
    "satts":"0",
}

state2 = ["001","0","60","0","0","0","42.999","-1.49972","320","15"]

ip = input("Server IP")

server = "http://"+ip+":420"

#Connect to socket
def connect_to_socket():
    sio.connect(server)

@sio.on('send_data')
def on_message(data):

    if data["type"]=="0":
        print("Data 0 type sent")
        sio.emit("send_data", state2)
    elif data["type"]=="1":
        print("Data 1 type sent")
        #loqsea1

@sio.on('send_image')
def on_message(data):
    print(data)
    ret, frame = cap.read()
    height, width = frame.shape[:2]
    frame = frame[60: int(height)-60, 0: int(width)]
    retval, buffer_img = cv2.imencode('.jpg', frame)
    data = str(base64.b64encode(buffer_img))
    sio.emit("send_image_b", {"xd":data})

@sio.event
def connect():
    global connected
    connected=True
    print("Connected.")

@sio.event
def disconnect():
    print("Disconnected.")
    connected=False

cap = cv2.VideoCapture(0)
scale = 0.50
quality = 50
#main
while not done:
    if not connected:
        connect_to_socket()
    ret, frame = cap.read()
    height, width = frame.shape[:2]
    frame = frame[60: int(height)-60, 0: int(width)]
    if cv2.waitKey(1) & 0xFF == ord('q'):
        cap.release()
        break

def exit_handler():
    sio.disconnect()
    done = True

atexit.register(exit_handler)