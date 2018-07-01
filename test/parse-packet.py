import sys
import re
sys.path.append('/Volumes/PPRJ/Projects/dfaprs')
import aprslib

print aprslib.parse("GERLCH>AP4R10,TCPIP*,qAC,NINTH:!4039.30NS11921.10W#PHG7050 W2 igate Black Rock Desert K1BRC")
print aprslib.parse("W6MTR-1>APRX28,TCPIP*,qAC,SEVENTH:!3952.25N/12042.67W`APRX and Raspberry Pi powered iGate and Digipeater")
