import aprslib
import json
import logging
import os
import sys
import time
import re
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
    feat = {
        "type": "Feature",
        "geometry": {
            "type": "Point", 
            "coordinates": [lng,lat], 
            },
        "properties": {
            "uuid": guid,
            "type": type_for_symbol(parsed_packet.get('symbol'), parsed_packet.get('symbol_table')),
            "callsign": callsign,
        },    
    }
    props = [
        ('posambiguity','accuracy'),
        ('timestamp','pts'),
        ('comment','aprscomment'),
    ]
    for (aprsprop,featprop) in props:
        val = parsed_packet.get(aprsprop)
        if val:
            feat['properties'][featprop] = val
    return feat


def process_packet(raw_packet):
    global target_urls,errstats
    errstats['received'] += 1
    logging.debug("\n")
    try:
        raw_packet = re.sub(r'[\n\r]', '', raw_packet)
        parsed_packet = aprslib.parse( raw_packet )
        logging.debug(json.dumps(parsed_packet,indent=3,sort_keys=True))
        errstats['parsed:ok'] += 1
    except Exception as err:
        logging.error( 'ERR failed to parse, %s: %s', err, raw_packet)
        errstats['parsed:err'] += 1
        return

    feat = feature_from_packet( parsed_packet )
    if feat is None:
        logging.debug('No location data, ignored')
        errstats['ignored'] += 1
        return
    
    logging.debug(json.dumps(feat,indent=3,sort_keys=True))
    logging.info('RCV %(type)s %(callsign)s%(comment)s @ [%(lng)f, %(lat)f]%(ts)s' % dict(
            lat=feat['geometry']['coordinates'][1],
            lng=feat['geometry']['coordinates'][0],
            type = feat['properties']['type'],
            comment = ' (' + feat['properties']['aprscomment'] + ')'\
                if feat['properties'].get('aprscomment') else '',
            ts = ' on ' + time.ctime(feat['properties']['pts'])\
                if feat['properties'].get('pts') else '',
            callsign = feat['properties']['callsign']))

    for base_url in target_urls:
        try:
            callsign = feat['properties']['callsign']
            kind = feat['properties']['type']
            url = "%s/features/%s/" % (base_url,feat['properties']['uuid'])
            req = urllib2.Request( url, json.dumps(feat), {'Content-Type': 'application/json'})
            response = urllib2.urlopen(req).read()
            logging.debug('SND %s', url)
            errstats['posted:ok'] += 1
        except Exception as err:
            errstats['posted:err'] += 1
            logging.error('ERR failed to post, %s: %s', err, url)
