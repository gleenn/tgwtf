.PHONY: all clean very-clean develop run

all: develop 

develop: env
	env/bin/python setup.py develop

install:
	cp dfaprs/dfaprs-upstartd.conf /etc/init/dfaprs.conf
	initctl reload-configuration
	start dfaprs

run: develop
	env/bin/dfaprs

clean:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	rm -rf dfaprs.egg-info
	rm -rf build

very-clean: clean
	rm -rf env

env:
	virtualenv env

