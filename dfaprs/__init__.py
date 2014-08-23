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
    print packet
    script = os.path.join(os.path.dirname(__file__), 'parser.pl')
    outs = subprocess.check_output( 
        [os.path.join(os.path.dirname(__file__), 'parser.pl'), packet] )
    data = json.loads(outs)

    if 'error' in data:
        print data['error']
    else:
        print data 
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

        if lat is None or lng is None or ts is None:
            print "Missing lat,lng, or timestamp"
            return

        print "APRS: %s is at %f,%f; seen at %s" % (callsign,lat,lng,
            datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))

        try:
            req = urllib2.Request(
                'http://127.0.0.1:8091/2014/api/objects/%s/' % callsign,
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
    time.sleep(3)
    with open(os.path.join(os.path.dirname(__file__), '../testpackets.txt' ), 'r') as inf:
        for line in inf.readlines():
            handle(line)

    # configure the serial connections (the parameters differs on the 
    # device you are connecting to)
    print "Listening to serial port..."
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
