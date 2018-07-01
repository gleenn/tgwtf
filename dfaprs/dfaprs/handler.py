import aprslib
import json
import logging
import os
import sys
import time
import re
import urllib2

from urlparse import urlparse
from collections import Counter
from uuid import UUID,uuid4,uuid3
from pprint import pprint
from datetime import datetime

APRS_NAMESPACE = UUID('a3eed8c0-106d-4917-8eb3-8779302bb8b1')

# http://www.aprs.org/symbols/symbolsX.txt
SYMBOLS = {
    "/>": [('mobile', 'vehicle')], 
    "\>": [('mobile', 'vehicle')],
    "#>": [('mobile', 'vehicle')],
    "E>": [('mobile', 'vehicle')],
    "H>": [('mobile', 'vehicle')],
    "S>": [('mobile', 'vehicle')],
    "V>": [('mobile', 'vehicle')],
    "/k": [('mobile', 'vehicle')],
    "\k": [('mobile', 'vehicle')],
    "4k": [('mobile', 'vehicle')],
    "Ak": [('mobile', 'vehicle')],
    "/u": [('mobile', 'vehicle')],
    "\u": [('mobile', 'vehicle')],
    "Bu": [('mobile', 'vehicle')],
    "Pu": [('mobile', 'vehicle')],
    "Tu": [('mobile', 'vehicle')],
    "Cu": [('mobile', 'vehicle')],
    "Gu": [('mobile', 'vehicle')],
    "Hu": [('mobile', 'vehicle')],
    "\^": [('mobile', 'aircraft')],
    "/^": [('mobile', 'aircraft')],
    "/g": [('mobile', 'aircraft')],
    "/=": [('mobile', 'train')], 
    "/[": [('mobile', 'person')],
    "S[": [('mobile', 'person')],
    "R[": [('mobile', 'person')],
    "H[": [('mobile', 'person')],
}

target_urls = []
errstats = Counter() 
symstats = Counter()
typestats = Counter()


def init(urls):
    global target_urls
    target_urls = urls


def tags_for_symbol(symbol,table):
    if not symbol or not table:
        return []
    key =  table.strip() + symbol.strip()
    symstats[key] += 1
    res = SYMBOLS.get(key,[]);
    return res


def create_feature(uuid, parsed_packet):
    callsign = parsed_packet['from']
    feat = {
        "type": "Feature",
        "properties": {
            "uuid": uuid,
            "callsign": callsign,
            "source": 'aprs',
            "slug": callsign.lower(),
        },    
    }
    for (k,v) in tags_for_symbol(parsed_packet.get('symbol'), parsed_packet.get('symbol_table')):
       feat['properties'][k] = v
    return update_feature(feat, parsed_packet)


def update_feature(feat, parsed_packet):
    lat = parsed_packet.get('latitude')
    lng = parsed_packet.get('longitude')

    feat['geometry'] = None if not lat or not lng else {
        "type": "Point", "coordinates": [lng,lat]}

    props = [
        ('posambiguity','locationaccuracy'),
        ('timestamp','lastseen'),
        ('comment','aprscomment'),
    ]
    for (aprsprop,featprop) in props:
        val = parsed_packet.get(aprsprop)
        if val:
            feat['properties'][featprop] = val if featprop != 'lastseen' else int(val)
    
    now = int(time.time())
    if not feat['properties'].get('lastseen') or feat['properties'].get('lastseen', 0) > now:
       feat['properties']['lastseen'] = now        
    if feat['properties'].get('source') != 'aprs':
        feat['properties']['locationsource'] = 'aprs'        
    return feat        

def update_log(path, raw_packet):
    with open(path, 'a') as outf:
        outf.write(datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ') + ' ' + raw_packet + '\n')

def update_file(path, parsed_packet):
    # construct feature
    callsign = parsed_packet['from']
    geometry = {"type": "Point", "coordinates": [parsed_packet["longitude"], parsed_packet["latitude"]]}\
        if 'longitude' in parsed_packet and 'latitude' in parsed_packet else None

    feat = {
        "type": "Feature",
        "geometry": geometry,
        "properties": {
            "aprs": callsign,
            "rawpacket": parsed_packet.get('raw'),
            "symbol": parsed_packet.get('symbol'),
            "comment": parsed_packet.get('comment'),
            "path": parsed_packet.get('path'),
        },    
    }
    props = [
        ('posambiguity','locationerror'),
        ('timestamp','lastseen'),
        ('comment','comment'),
    ]
    for (aprsprop,featprop) in props:
        val = parsed_packet.get(aprsprop)
        if val:
            feat['properties'][featprop] = val if featprop != 'lastseen' else int(val)
    
    if not feat['properties'].get('lastseen'):
        feat['properties']['lastseen'] = int(time.time())        

    # load collection from file
    try:
        with open(path, 'r') as inf:
            collection = json.load(inf)
        logging.debug('Loaded %s', path)
    except Exception as err:
        logging.debug('%s: %s', path, err)
        collection = {"type": "FeatureCollection", "features": []}

    collection['features'] = filter(lambda f: f['properties'].get('aprs') != callsign, collection['features'])
    collection['features'].append(feat)
    logging.debug('Saving %s', path)
    with open(path + '.tmp', 'w') as outf:
        json.dump(collection, outf, indent=3)
    os.rename(path + '.tmp', path)
    return len(collection['features'])


def process_packet(raw_packet):
    global target_urls,errstats
    errstats['receive'] += 1
    logging.debug("\n")
    try:
        raw_packet = re.sub(r'[\n\r]', '', raw_packet)
        logging.info("RAW %s", raw_packet)
        parsed_packet = aprslib.parse( raw_packet )
        logging.debug(json.dumps(parsed_packet,indent=3,sort_keys=True))
        errstats['parse:ok'] += 1
    except Exception as err:
        logging.error( 'ERR failed to parse, %s: %s', err, raw_packet)
        errstats['parse:err'] += 1
        return

    callsign = parsed_packet['from']
    logging.info('RCV %(tags)s %(callsign)s%(comment)s @ [%(lng)s, %(lat)s]%(ts)s' % dict(
            lat=parsed_packet.get('latitude'),
            lng=parsed_packet.get('longitude'),
            tags= ' '.join([':'.join(tag) for tag in tags_for_symbol(parsed_packet.get('symbol'), parsed_packet.get('symbol_table'))]),
            comment = ' (' + parsed_packet.get('comment') + ')'\
                if 'comment' in parsed_packet else '',
            ts = ' on ' + time.ctime(parsed_packet['timestamp'])\
                if 'timestamp' in parsed_packet else '',
            callsign=callsign))

    for base_url in target_urls:
        if base_url.startswith('log+file://'):
            sz = update_log(urlparse(base_url).path, raw_packet)
            logging.info('LOG %s', raw_packet)
            continue
        if base_url.startswith('file://'):
            sz = update_file(urlparse(base_url).path, parsed_packet)
            logging.info('SAV %s, %d stations tracked', callsign, sz)
            continue
        # elif base_url.startswith('/'):
        #     if callsign != 'DFGUPY':
        #         continue
        #     logging.info('Writing GUPPY location to file')
        #     with open(base_url, 'w') as f:
        #         f.write('longitude: %s\n' % parsed_packet['longitude'])
        #         f.write('latitude: %s\n' % parsed_packet['latitude'])
        #     continue

        try:
            uuid = str(uuid3(APRS_NAMESPACE,callsign.encode('ascii')))
            if callsign == 'DISCOF':
                url = "%s/features/discofish/" % (base_url)
            else:
                url = "%s/features/%s/" % (base_url,callsign.lower())
            req = urllib2.Request(url)
            feat = json.loads(urllib2.urlopen(req).read())
            update_feature(feat, parsed_packet)
    
            logging.info('UPD %s:%s', callsign, uuid)
        #except Exception as err:
        except EnvironmentError as err:
            errstats['get:err'] += 1
            if isinstance(err, urllib2.HTTPError) and err.getcode() == 404:
                feat = create_feature(uuid, parsed_packet)
                logging.info('NEW %s:%s', callsign, uuid)
            else:
                logging.error('ERR failed to process %s: %s', base_url, err)
                continue

        logging.debug(json.dumps(feat,indent=3,sort_keys=True))

        try:
            req = urllib2.Request( url, json.dumps(feat), {'Content-Type': 'application/json'})
            response = urllib2.urlopen(req).read()
            logging.info('SND %s', url)
            errstats['post:ok'] += 1
        except Exception as err:
            errstats['post:err'] += 1
            logging.error('ERR failed to post, %s: %s', err, url)
