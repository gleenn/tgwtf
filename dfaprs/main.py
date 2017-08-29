import aprslib
import argparse
import glob
import json
import logging
import os
import re
import serial
import signal
import sys
import time
import urllib2

from .handler import process_packet,errstats,typestats,symstats,init

DEFAULT_SERIAL_BPS = 9600

def stat(sig,frame):
    if len(errstats) > 0:
        logging.info(errstats)

    if len(typestats) > 0:
        logging.info(typestats)

    if len(errstats) <=0 and len(typestats) <= 0:
        logging.info("Nothing have been received yet")
    #logging.info(symstats)


def exit(sig, frame):
    # Rewing ^C
    if sig == signal.SIGINT:
        print "\n"
    stat(sig,frame)
    if sig == signal.SIGINT:
        print "Interrupted, exiting..."
    else:
        logging.info("Terminated, exiting...")
    sys.exit(0)
 

def main():
    global target_urls
    argparser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog= 
            'examples:\n'
            '  Save APRS data received from internet:\n'
            '    %(dfaprs)s -s aprs://rotate.aprs2.net -t log+file:///var/opt/dfaprs/beacons.log file:///var/opt/dfaprs/beacons.json\n'
            '\n'
            '  Save APRS data received from serial port:\n'
            '    %(dfaprs)s -s "serial:///dev/ttyUSB*,%(bps)d" -t file:///var/opt/dfaprs/beacons.json\n' 
            '\n'
            '  Post APRS data received from internet:\n'
            '    %(dfaprs)s -s aprs://noam.aprs2.net -t http://localhost:8091\n'
            '\n'
            '  Post APRS data received from serial port:\n'
            '    %(dfaprs)s -s "serial:///dev/ttyUSB*,%(bps)d" -t http://localhost:8091\n' 
            '\n'
            '  Parse APRS packets from file:\n'
            '    %(dfaprs)s -s file://test/sample-raw.txt\n'
            '\n'
            '  Log statistics:\n'
            '    killall -HUP dfaprs\n'
            '\n'
            'environment variables:\n'
            '  BRCMAP_URL\tSame as --target option' % dict(
                dfaprs=sys.argv[0],
                bps=DEFAULT_SERIAL_BPS)
        )
    argparser.add_argument('-v', '--verbose', help="show debug output", action='store_true')
    argparser.add_argument('-s', '--source', help="get APRS data from given source", metavar='URL')
    argparser.add_argument('-t', '--target', help="post APRS data in GeoJSON format to given URLs", nargs='*', metavar='URL')
    args = argparser.parse_args()
    if args.target is None:
        if 'BRCMAP_URL' in os.environ:
            args.target = [os.environ['BRCMAP_URL']]
        else:
            args.target = []
    if args.source is None:
        argparser.print_help()
        sys.exit(1)

    signal.signal(signal.SIGTERM, exit)
    signal.signal(signal.SIGINT, exit)
    signal.signal(signal.SIGHUP, stat)

    target_urls = []
    for base_url in args.target:
        if not base_url.startswith('/') and not base_url.startswith('file://') and not base_url.startswith('log+file://'):
            target_urls.append(base_url + '/api/v2')
        else:
            target_urls.append(base_url)
    init(target_urls)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
        format='%(message)s')

    logging.info("Starting dfaprs, source: %s, target: %s", args.source, ','.join(target_urls))

    if args.source.startswith('file://'):
        file = args.source[7:]
        logging.info('Reading from %s', file)
        with open(file, 'r') as inf:
            while True:
                raw_packet = inf.readline()
                if not raw_packet:
                    break
                process_packet(raw_packet)
        exit(None,None)
    elif args.source.startswith('aprs://'):
        host = args.source[7:]
        AIS = aprslib.IS("N0CALL", host=host, port=14580)
        #AIS.set_filter('r/37.371111/-122.0375/100 r/40.79608429483125/-119.19589964220306/100')
        AIS.set_filter('r/40.79608429483125/-119.19589964220306/200')
        backoff = 1
        while True:
            try:
                logging.info('Connecting to %s', host)
                AIS.connect()
                backoff = 1
                AIS.consumer(process_packet, raw=True)
            except Exception as err:
                logging.error(err)
                logging.info('Reconnecting')
                backoff = min(backoff*2,300)
                time.sleep(backoff)
    elif args.source.startswith( 'serial://'):
        ttysettings = args.source[9:].split(',')
        ttypat = ttysettings[0]
        ttybps = int(ttysettings[1]) if len(ttysettings)>1 else DEFAULT_SERIAL_BPS
        backoff = 1
        while True:
            try:
                ttys = glob.glob(ttypat)
                if len(ttys) > 0:
                    tty = ttys[0]
                else:
                    raise Exception("No files match %s" % ttypat)

                logging.info('Reading from %s at %d bps', tty, ttybps )
                ser = serial.Serial(
                    port=tty,
                    baudrate=ttybps,
                    xonxoff=0
                )
                if ser.isOpen():
                    logging.warn("%s was already open", tty)
                    ser.close()
                ser.open()
                if ser.isOpen():
                    backoff = 1
                    while True:
                        out = ''
                        time.sleep(1)
                        while ser.inWaiting() > 0:
                            out += ser.read(1)
                        if out != '':
                            process_packet(out)
            except Exception as err:
                logging.error(err)
                try:
                    ser.close()
                except:
                    pass
                backoff = min(backoff*2,300)
                logging.info("Retrying in %d seconds", backoff)
                time.sleep(backoff)
    else:
        print "Invalid source:", args.source
