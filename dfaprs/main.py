import aprslib
import argparse
import json
import logging
import os
import signal
import serial
import sys
import time
import urllib2

from .mapclient import process_packet,errstats,typestats,symstats,init
from .install import install


def stat(sig,frame):
    logging.info(errstats)
    logging.info(typestats)
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
        epilog="You can also specify where to post data via BRCMAP_URL environment variable")
    argparser.add_argument('-v', '--verbose', help="show debug output", action='store_true')
    argparser.add_argument('-s', '--source', help="get APRS data from given source")
    argparser.add_argument('-t', '--target', help="post APRS data in GeoJSON format to given URLs", nargs='*')
    argparser.add_argument('--install', help="install as a service", action='store_true')
    args = argparser.parse_args()
    if args.target is None:
        if 'BRCMAP_URL' in os.environ:
            args.target = [os.environ['BRCMAP_URL']]
        else:
            args.target = []
    if args.source is None:
        argparser.print_help()
        exit(1)

    if args.install:
        install('--source=%s --target=%s' % (args.source,' '.join(args.target)))
    else:
        signal.signal(signal.SIGTERM, exit)
        signal.signal(signal.SIGINT, exit)
        signal.signal(signal.SIGUSR1, stat)

        target_urls = [base + '/2014/api' for base in args.target];
        init(target_urls)
        logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
            format='%(message)s')
        logging.info( "Source: %s", args.source )
        logging.info( "Target: %s", ','.join(target_urls))

        if args.source.startswith('file://'):
            file = args.source[7:]
            logging.info('Reading %s', file)
            with open(file, 'r') as inf:
                while True:
                    raw_packet = inf.readline()
                    if not raw_packet:
                        break
                    process_packet(raw_packet)
            exit(None,None)
        elif args.source.startswith('aprs://'):
            host = args.source[7:]
            logging.info('Connecting to %s', host)
            AIS = aprslib.IS("N0CALL", host=host, port=14580)
            AIS.set_filter('r/37.371111/-122.0375/100 r/40.79608429483125/-119.19589964220306/100')
            backoff = 1
            while True:
                try:
                    AIS.connect()
                    backoff = 1
                    AIS.consumer(process_packet, raw=True)
                except Exception as err:
                    logging.error(err)
                    logging.info('Reconnecting')
                    backoff = min(backoff*2,300)
                    time.sleep(backoff)
        elif args.source.startswith( 'serial://'):
            tty = args.source[9:]
            logging.info('Reading from serial device %s', tty )
            try:
                ser = serial.Serial(
                    port=tty,
                    baudrate=19200,
                    xonxoff=0
                )
            except Exception as err:
                logging.error(err)
                sys.exit(1)

            while True:
                try:
                    if ser.isOpen():
                        logging.warn("%s was already open", tty)
                        ser.close()
                    ser.open()
                    if ser.isOpen():
                        logging.debug("%s is now open", tty)
                        while True:
                            out = ''
                            time.sleep(1)
                            while ser.inWaiting() > 0:
                                out += ser.read(1)
                            if out != '':
                                process_packet(out)
                except Exception as err:
                    logging.error(err)
                    ser.close()
                    time.sleep(10)
        else:
            print "Invalid source", args.source
