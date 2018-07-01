from __future__ import print_function
import sys
import re
import random
import json
import subprocess
from pprint import pprint
sys.path.append('/Volumes/PPRJ/Projects/dfaprs')
import aprslib

def esc(s):
    return unicode(s).replace('\\', '\\\\').replace('"', '\\"')

def fopt(v):
    return 'Some({})'.format(v) if v else 'None'


def sopt(v):
    return 'Some(String::from("{}"))'.format(esc(v)) if v else 'None'

def parse_perl(msg):
    r = json.loads(subprocess.check_output([
        'docker', 'run', '--rm', 'perl-fap-parse', raw_packet]))
    pprint(r)
    print()
    r['from'] = r['srccallsign']
    r['to'] = r['dstcallsign']
    #r['latitude'] = r[]
    return r

def parse_py(msg):
    return aprslib.parse( raw_packet )


log = '/Volumes/PPRJ/Tmp/liveplaya-beacons.log'
outfile = '/Volumes/PPRJ/Projects/fap-rs/src/tests.rs'

random.seed(0)
lines_total = 0
parsed_ok = 0
has_location = 0
header = u'''
// !!! auto-generated, DO NOT EDIT !!!
use parse_str;

fn round(n : f64) -> f64 {
   (1000.0*n).round()/1000.0
}

#[test]
fn errors() {
    let raw = "W6MTR-1>APRX28,TCPIP*,q.25N/12042.67W`APRX and Raspberry Pi powered iGate";
    assert!( parse_str(raw).is_err() );

}

#[test]
fn parsing() {
'''

with open(outfile, 'w') as out:
    #out = sys.stdout
    print(header, file=out)
    for line in open(log, 'r'):
            if random.randint(0, 50000) != 0:
                continue
            lines_total += 1
            try:
                raw_packet = re.sub(r'[\n\r]', '', line)[21:]
                parsed_packet = parse_py( raw_packet )

                print('         let raw = "{}";'.format(esc(raw_packet)), file=out)
                print('         let parsed = parse_str(raw).unwrap();', file=out)
                print('         assert_eq!( parsed.raw(), String::from(raw) );', file=out)
                print('         assert_eq!( parsed.src_callsign(), String::from("{}"));'.format(parsed_packet['from']), file=out)
                print('         assert_eq!( parsed.dst_callsign(), String::from("{}"));'.format(parsed_packet['to']), file=out)
                print('         assert_eq!( parsed.latitude().map(round), {}.map(round));'.format(fopt(parsed_packet.get('latitude'))), file=out)
                print('         assert_eq!( parsed.longitude().map(round), {}.map(round));'.format(fopt(parsed_packet.get('longitude'))), file=out)
                print('         assert_eq!( parsed.comment(), {});'.format(sopt(parsed_packet.get('comment'))), file=out)
                print('', file=out)

                parsed_ok += 1
                lat=parsed_packet.get('latitude'),
                lng=parsed_packet.get('longitude'),
                if lat and lng:
                    has_location += 1
            except:
                pass
    print('}\n', file=out)

print("// Saved to {}".format(outfile))
print("// Processed        %d line(s)" % (lines_total))
print("// Parsed:          %d " % (parsed_ok))
print("// Has location:    %d " % (has_location))
