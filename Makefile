.PHONY: all clean very-clean develop run

all: develop 

develop: env
	env/bin/python setup.py develop

run-file: develop
	env/bin/dfaprs --source=file://test/sample-raw.txt --verbose

run-network: develop
	env/bin/dfaprs --source=aprs://noam.aprs2.net --verbose

run-serial: develop
	env/bin/dfaprs --source=serial:///dev/ttyUSB0 --verbose

install-serial: 
	env/bin/python setup.py install
	env/bin/dfaprs --install --source=serial:///dev/ttyUSB0 --target=http://localhost:8090

install-network: 
	env/bin/python setup.py install
	env/bin/dfaprs --install --source=aprs://noam.aprs2.net --target=http://localhost:8092

stat:
	killall -s 16 dfaprs 

env:
	virtualenv env

clean:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	rm -rf dfaprs.egg-info
	rm -rf build
	rm -rf env

stage:
	ssh root@www01.brcmap.org "cd /opt/dfaprs && git pull --ff-only && make install-network"

