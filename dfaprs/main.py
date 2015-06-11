import aprslib
import argparse
import glob
import json
import logging
import os
import serial
import signal
import sys
import time
import urllib2

from .mapclient import process_packet,errstats,typestats,symstats,init


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
            '  Post APRS data received from network:\n'
            '    dfaprs -v -s aprs://noam.aprs2.net -t http://localhost:8091\n'
            '\n'
            '  Post APRS data received from serial port:\n'
            '    dfaprs -v -s "serial:///dev/ttyUSB*" -t http://localhost:8091\n' 
            '\n'
            '  Parse APRS packets from file:\n'
            '    dfaprs -v -s file://test/sample-raw.txt\n'
            '\n'
            '  Log statistics:\n'
            '    killall -HUP dfaprs\n'
            '\n'
            'environment variables:\n'
            '  BRCMAP_URL\tSame as --target option'
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

    target_urls = [base + '/2014/api' for base in args.target];
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
        AIS.set_filter('r/37.371111/-122.0375/100 r/40.79608429483125/-119.19589964220306/100')
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
        ttypat = args.source[9:]
        backoff = 1
        while True:
            try:
                ttys = glob.glob(ttypat)
                if len(ttys) > 0:
                    tty = ttys[0]
                else:
                    raise Exception("No files match %s" % ttypat)

                logging.info('Reading from %s', tty )
                ser = serial.Serial(
                    port=tty,
                    baudrate=19200,
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
