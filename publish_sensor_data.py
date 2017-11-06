#!/usr/bin/env python

from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import re
import serial
import time
import json

SENSORS = {
    'light': {
        'pattern': r'Light:\s+(\d+)',
        'topic': 'light',
        },
    'temp': {
        'pattern': r'Temperature:\s+(\d+)',
        'topic': 'temperature',
        },
    'sound': {
        'pattern': r'Sound:\s+(\d+)',
        'topic': 'sound',
        },
    }

ser = serial.Serial("/dev/ttyACM0", 9600)  #change ACM number as found from ls /dev/tty/ACM*
ser.baudrate = 9600


host = 'a35hxcoh9dgox2.iot.us-west-2.amazonaws.com'
rootCAPath = 'root-CA.crt'
certificatePath = 'Sensors_board.cert.pem'
privateKeyPath = 'Sensors_board.private.key'

clientId = 'Raspberry'

# Configure logging
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

# Init AWSIoTMQTTClient
myAWSIoTMQTTClient = None

myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
myAWSIoTMQTTClient.configureEndpoint(host, 8883)
myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec
myAWSIoTMQTTClient.onMessage = customOnMessage

# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect()
for sensor in SENSORS.values():
    print(sensor)
    myAWSIoTMQTTClient.subscribeAsync(sensor['topic'], 1)
time.sleep(2)

while True:
    try:
        line = ser.readline().decode()
        print(line)
    except UnicodeDecodeError:
        print('UnicodeDecodeError:', line)
        time.sleep(30)
        continue
    for sensor, sensor_dict in SENSORS.items():
        try:
            m = re.match(sensor_dict['pattern'], line)
            if m:
                timestamp = int(round(time.time() * 1000))
                sensor_value = m.group(1)
                myAWSIoTMQTTClient.publishAsync(
                    sensor_dict['topic'],
                    json.dumps({sensor: int(sensor_value), "time": timestamp}),
                    1,
            )
        except Exception as e:
            print(e)
    time.sleep(30)
