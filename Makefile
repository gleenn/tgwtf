.PHONY: all start stop restart clean install
PRJDIR:=${CURDIR}

all:
	${MAKE} -C ${PRJDIR}/dfaprs all

start: all
	mkdir -p ${PRJDIR}/var/run
	mkdir -p ${PRJDIR}/var/pid
	dfaprs/env/bin/dfaprs -s aprs://noam.aprs2.net -t file://${PRJDIR}/var/run/mapdata.json & echo $$! > ${PRJDIR}/var/pid/dfaprs.pid
	caddy & echo $$! > ${PRJDIR}/var/pid/caddy.pid

stop:
	-kill -9 `cat ${PRJDIR}/var/pid/dfaprs.pid`
	-kill -9 `cat ${PRJDIR}/var/pid/caddy.pid`

restart: all stop start

clean: stop
	${MAKE} -C ${PRJDIR}/dfaprs clean
	rm -rf ${PRJDIR}/var
	mkdir -p ${PRJDIR}/var/run
	mkdir -p ${PRJDIR}/var/pid

install: all
	mkdir -p /opt/tgwtf/www
	mkdir -p /var/run/dfaprs/
	cp -r ${PRJDIR}/www/* /opt/tgwtf/www/
	chmod -R a+xr /opt/tgwtf
	chmod -R a+xr /var/run/dfaprs/
	cp ${PRJDIR}/nginx.conf /etc/nginx/sites-enabled/tgwtf.conf
	service nginx restart
