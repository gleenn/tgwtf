# -*- coding: utf-8 -*-
import logging
import os
import sys
import json
import subprocess
import time
import serial
import urllib2

from datetime import datetime

CALLSIGNS = {
    'DISCOF': 'DiscoFish',
}


def handle(packet):
    script = os.path.join(os.path.dirname(__file__), 'parser.pl')
    outs = subprocess.check_output( 
        [os.path.join(os.path.dirname(__file__), 'parser.pl'), packet] )
    data = json.loads(outs)

    callsign = data.get('srccallsign')
    lat = data.get('latitude')
    lng = data.get('longitude')
    ts = data.get('timestamp')
    accuracy = data.get('posresolution')

    if callsign in CALLSIGNS: 
        type = 'vehicle'
        name = CALLSIGNS[callsign]
    else:
        type = 'beacon'
        name = callsign

    print "APRS: %s is at %f,%f; seen at %s" % (callsign,lat,lng,
        datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))

    try:
        req = urllib2.Request(
            'http://127.0.0.1:8080/2014/api/objects/%s/' % callsign,
            data = json.dumps({
                'lat': lat, 
                'lng': lng, 
                'ts': ts, 
                'type':type,
                'name':name,
                'accuracy':accuracy }),
            headers = {
                'Content-Type':'application/json; charset=utf-8'
                }
        )
        resp = urllib2.urlopen(req)
        content = resp.read()

    except Exception as err:
        print "Posting update failed: %s" % err


def main():
    # test
    handle('TEST>APT314,WIDE1-1,WIDE2-1:/235256h3724.62N/12201.17W>000/000/KG6YJN|!"%2\'^|!w4a!')

    # configure the serial connections (the parameters differs on the 
    # device you are connecting to)
    while(1):
        try:
            ser = serial.Serial(
                port='/dev/ttyUSB0',
                baudrate=19200,
                xonxoff=0
            )

            if ser.isOpen():
                print "Serial port was already open!"
                ser.close()

            ser.open()

            if ser.isOpen():
                print "Serial port is now open!"

                while 1 :
                    out = ''
                    time.sleep(1)
                    while ser.inWaiting() > 0:
                        out += ser.read(1)
                    if out != '':
                        handle( out )
        except KeyboardInterrupt:
            ser.close()
            exit()
        except Exception as err:
            print err
            time.sleep(10)
