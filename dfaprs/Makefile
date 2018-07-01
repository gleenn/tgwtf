.PHONY: all clean very-clean develop run

all: develop 

develop: env
	env/bin/python setup.py develop

install: env
	python setup.py install

stat:
	sudo killall -HUP dfaprs 

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
	ssh root@stage.brcmap.org "cd dfaprs && git pull --ff-only && make install && systemctl reset-failed dfaprs.service && systemctl restart dfaprs.service"

release:
	ssh root@www.brcmap.org "cd dfaprs && git pull --ff-only && make install && systemctl reset-failed dfaprs.service && systemctl restart dfaprs.service"
