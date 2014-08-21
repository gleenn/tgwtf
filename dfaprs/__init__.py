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

def handle(packet):
	outs = subprocess.check_output( 
		[os.path.join(os.path.dirname(__file__), 'parser.pl')] )
	data = json.loads(outs)

	callsign = data.get('srccallsign')
	lat = data.get('latitude')
	lng = data.get('longitude')
	ts = data.get('timestamp')
	accuracy = data.get('posresolution')

	type = 'vehicle' if callsign in ('DISCOF') else 'beacon'

	print "APRS: %s is at %f,%f; seet at %s" % (callsign,lat,lng,
		datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))

	try:
		urllib2.urlopen( 'http://127.0.0.1:8080/2014/api/objects/%s/' % callsign,
			data = json.dumps({'lat': lat, 'lng': lng, 'ts': ts, 'type': type, 
			'accuracy':accuracy }),
			headers = {'Content-Type':'application/json; charset=utf-8'})
	except:
		print "Posting update failed"


def main():
	# test
	handle('DFISH>APT314,WIDE1-1,WIDE2-1:/235256h3724.62N/12201.17W>000/000/KG6YJN|!"%2\'^|!w4a!')

	# configure the serial connections (the parameters differs on the 
	# device you are connecting to)
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


	try:
	    while 1 :
	        out = ''
	        time.sleep(1)
	        while ser.inWaiting() > 0:
	            out += ser.read(1)
	        if out != '':
	            print ">>" + out

	except KeyboardInterrupt:
	    ser.close()

	ser.close()
	exit()


