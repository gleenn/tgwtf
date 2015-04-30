import os
import sys
import logging
import platform
import subprocess

SYSTEMD_CONF_TPL = '''[Unit]
Description=APRS to BRC Map bridge

[Service]
ExecStart=/opt/dfaprs/env/bin/dfaprs %(flags)s
Restart=always
StandardOutput=syslog
SyslogIdentifier=dfaprs
User=nobody
Group=nobody
WorkingDirectory=/root

[Install]
WantedBy=multi-user.target
'''

UPSTARTD_CONF_TPL = '''description "APRS to BRC Map bridge"
author "Dmitry Azovtsev"

start on runlevel [2345]
stop on runlevel [!2345]

expect fork

respawn
respawn limit 5 5

script
    /opt/dfaprs/env/bin/dfaprs %(flags)s 2&>1 | logger -t dfaprs    
    echo $$ > /var/run/dfaprs.pid 
end script

post-start script
end script

pre-start script
        echo Starting dfaprs
end script

pre-stop script
        echo Stopping dfaprs
end script
'''

    # cp dfaprs/dfaprs-upstartd.conf /etc/init/dfaprs.conf
    # initctl reload-configuration
    # start dfaprs

def checkroot():
    if os.getuid() != 0:
        raise RuntimeError( "Must run as root!" )


def install(flags):
    name = 'dfaprs'
    platform_id = platform.platform()

    if platform_id.find('-centos-7.')>=0:
        checkroot() 
        print "Writing systemd config file"
        with open( '/usr/lib/systemd/system/dfaprs%s.service' % name, "w") as outf:
            outf.write(SYSTEMD_CONF_TPL % {flags:flags})
        print "Enabling service"
        subprocess.check_call(['/usr/bin/systemctl', 'reset-failed', name + '.service'])
        subprocess.check_call(['/usr/bin/systemctl', 'enable', name + '.service'])
        print "Restarting service"
        subprocess.check_call(['/usr/bin/systemctl', 'restart', name + '.service'])
    else:
        raise RuntimeError("Don't know how to install %s on %s" % (name, platform_id))


