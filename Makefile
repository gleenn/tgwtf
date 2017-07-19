.PHONY: all start stop restart clean install
PRJDIR := $(shell pwd)
WSDIR := $(PRJDIR)/..

all:
	$(MAKE) -C $(WSDIR)/dfaprs all
	$(MAKE) -C $(WSDIR)/brcmapjs all

start: 
	mkdir -p var/run
	$(WSDIR)/dfaprs/env/bin/dfaprs -s aprs://noam.aprs2.net -t file://$(PRJDIR)/var/run/mapdata.json & echo $$! > $(PRJDIR)/var/pid/dfaprs.pid
	caddy & echo $$! > $(PRJDIR)/var/pid/caddy.pid

stop:
	kill -9 `cat $(PRJDIR)/var/pid/dfaprs.pid`
	kill -9 `cat $(PRJDIR)/var/pid/caddy.pid`

restart: all stop start

clean: stop
	rm -rf var
	mkdir -p var/run
	mkdir -p var/pid

install: all
	-service brcmap disable
	mkdir -p /opt/dfwtf/www
	mkdir -p /var/run/dfaprs/
	cp -r www/* /opt/dfwtf/www/
	chmod -R a+xr /opt/dfwtf
	chmod -R a+xr /var/run/dfaprs/
	cp nginx.conf /etc/nginx/sites-enabled/dfwtf.conf
	service nginx restart
