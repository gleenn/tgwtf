import aprslib
import json
import logging
import os
import sys
import time
import urllib2

from collections import Counter
from uuid import UUID,uuid4,uuid3
from pprint import pprint

APRS_NAMESPACE = UUID('a3eed8c0-106d-4917-8eb3-8779302bb8b1')

# http://www.aprs.org/symbols/symbolsX.txt
SYMBOLS = {
    '/>': 'vehicle', # car
    '/_': 'weather', 
    '/-': 'house', 
    '\>': 'vehicle',
    '\^': 'aircraft',
    '/^': 'aircraft',
    '/g': 'aircraft',
    '/=': 'train', 
    '//': 'beacon', # red dot
    '/&': 'beacon', # HF Gateway
    '/k': 'beacon', # school
}

target_urls = []
errstats = Counter() 
symstats = Counter()
typestats = Counter()


def init(urls):
    global target_urls
    target_urls = urls

def type_for_symbol(symbol,table):
    if not symbol or not table:
        return 'beacon'
    key =  table.strip() + symbol.strip()
    symstats[key] += 1
    res = SYMBOLS.get(key,'beacon');
    typestats[res] += 1
    return res

def feature_from_packet(parsed_packet):
    lat = parsed_packet.get('latitude')
    lng = parsed_packet.get('longitude')
    if (not lat or not lng):
        return None

    callsign = parsed_packet['from']
    guid = str(uuid3(APRS_NAMESPACE,callsign.encode('ascii')))
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point", 
            "coordinates": [lng,lat], 
            },
        "properties": {
            "uuid": guid,
            "type": type_for_symbol(parsed_packet.get('symbol'), parsed_packet.get('symbol_table')),
            "callsign": callsign,
            "aprscomment": parsed_packet.get('comment'),
            "ts": parsed_packet.get('timestamp',None)
        },    
    }


def process_packet(raw_packet):
    global target_urls,errstats
    errstats['received'] += 1
    logging.debug("\n")
    try:
        parsed_packet = aprslib.parse( raw_packet )
        logging.debug(json.dumps(parsed_packet,indent=3,sort_keys=True))
        errstats['parsed:ok'] += 1
    except Exception as err:
        logging.error( 'PARSE ERROR: %s', err)
        errstats['parsed:err'] += 1
        return

    feat = feature_from_packet( parsed_packet )
    if feat is None:
        logging.debug('Ignored')
        errstats['ignored'] += 1
        return
    
    logging.debug(json.dumps(feat,indent=3,sort_keys=True))

    for base_url in target_urls:
        try:
            callsign = feat['properties']['callsign']
            kind = feat['properties']['type']
            url = "%s/features/%s/" % (base_url,feat['properties']['uuid'])
            req = urllib2.Request( url, json.dumps(feat), {'Content-Type': 'application/json'})
            response = urllib2.urlopen(req).read()
            logging.debug('posted %s/%s %s', callsign,kind,url)
            errstats['posted:ok'] += 1
        except Exception as err:
            errstats['posted:err'] += 1
            logging.error('FAILED %s/%s %s: %s', feat['properties'].get('callsign'),
                feat['properties']['type'],url,err)
