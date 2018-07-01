import sys
import re
sys.path.append('/Volumes/PPRJ/Projects/dfaprs')
import aprslib

log = '/Volumes/PPRJ/Tmp/liveplaya-beacons.log'

lines_total = 0
parsed_ok = 0
has_location = 0
for line in open(log, 'r'):
        lines_total += 1
        try:
            raw_packet = re.sub(r'[\n\r]', '', line)[21:]
            parsed_packet = aprslib.parse( raw_packet )
            callsign = parsed_packet['from']
            #print callsign
            parsed_ok += 1
            lat=parsed_packet.get('latitude'),
            lng=parsed_packet.get('longitude'),
            if lat and lng:
                has_location += 1
        except:
            pass

        # if lines_total > 10:
        #     break
 

print "Processed        %d line(s)" % (lines_total)
print "Parsed:          %d " % (parsed_ok)
print "Has location:    %d " % (has_location)

