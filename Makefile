.PHONY: all debug release-armv7 run clean deploy
SOURCE_DIR:=${CURDIR}
CARGO:=cargo
DOCKER:=docker

all: debug release-armv7

debug: 
	${CARGO} build

release-armv7:
	${CARGO} build --target=armv7-unknown-linux-gnueabihf --release

run: 
	${CARGO} run -- --log=/tmp/aprs-beacons.log --docroot=${SOURCE_DIR}/www

clean: 
	${CARGO} clean

setup: 
	@if [ -z ${TGWTF_HOST} ]; then echo "Please set TGWTF_HOST environment variable" && exit -1; fi
	cat ${HOME}/.ssh/id_rsa.pub | ssh pi@${TGWTF_HOST} 'sudo mount -o remount,rw / && mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
	ssh pi@${TGWTF_HOST} 'sudo mkdir -p /root/.ssh && sudo cp /home/pi/.ssh/authorized_keys /root/.ssh/authorized_keys'
	ssh pi@${TGWTF_HOST} 'sudo apt-get update && sudo apt-get upgrade -y'

setup-kiosk-mode:
	ssh pi@${TGWTF_HOST} 'sudo apt-get install chromium-bsu x11-xserver-utils unclutter -y'
	ssh root@${TGWTF_HOST} 'sudo sed -i -e "s/@xscreensaver -no-splash/#@xscreensaver -no-splash/" /etc/xdg/lxsession/LXDE-pi/autostart'
	ssh root@${TGWTF_HOST} 'echo "@xset s off\n@xset -dpms\n@xset s noblank" >> /etc/xdg/lxsession/LXDE-pi/autostart'
	ssh root@${TGWTF_HOST} "sudo sed -i 's/\"exited_cleanly\": false/\"exited_cleanly\": true/' ~root/.config/chromium/Default/Preferences"
	ssh root@${TGWTF_HOST} "sudo sed -i 's/\"exited_cleanly\": false/\"exited_cleanly\": true/' ~pi/.config/chromium/Default/Preferences"


setup-realtime-clock:
	@if [ -z ${TGWTF_HOST} ]; then echo "Please set TGWTF_HOST environment variable" && exit -1; fi
	ssh -t root@${TGWTF_HOST} 'sudo apt-get install i2c-tools -y'
	ssh -t root@${TGWTF_HOST} 'sed -i -e "s/#dtparam=i2c_arm=on/dtparam=i2c_arm=on/" /boot/config.txt'
	#ssh -t root@${TGWTF_HOST} 'sed -i -e "s/#dtoverlay=i2c-rtc,pcf8523/dtoverlay=i2c-rtc,pcf8523/" /boot/config.txt'
	ssh -t root@${TGWTF_HOST} 'echo "dtoverlay=i2c-rtc,pcf8523" >> /boot/config.txt'
	ssh -t root@${TGWTF_HOST} 'sed -i -e "s/if [ -e \/run\/systemd\/system ] ; then\nexit 0\nfi//" /boot/config.txt'


deploy: release-armv7
	@if [ -z ${TGWTF_HOST} ]; then echo "Please set TGWTF_HOST environment variable" && exit -1; fi
	@if [ -z ${CARGO_TARGET_DIR} ]; then echo "Please set CARGO_TARGET_DIR environment variable" && exit -1; fi
	-ssh root@${TGWTF_HOST} "service tgwtf stop"
	ssh pi@${TGWTF_HOST} "sudo mount -o remount,rw /"
	ssh root@${TGWTF_HOST} "mkdir -p /opt/tgwtf/bin && mkdir -p /opt/tgwtf/etc && mkdir -p /opt/tgwtf/www"	
	scp ${SOURCE_DIR}/etc/tgwtf.service.conf root@${TGWTF_HOST}:/etc/systemd/system/tgwtf.service
	scp ${SOURCE_DIR}/www/index.html root@${TGWTF_HOST}:/opt/tgwtf/www/index.html
	scp ${SOURCE_DIR}/www/liveplaya.debug.js root@${TGWTF_HOST}:/opt/tgwtf/www/liveplaya.debug.js
	scp ${CARGO_TARGET_DIR}/armv7-unknown-linux-gnueabihf/release/tgwtf root@${TGWTF_HOST}:/opt/tgwtf/bin/tgwtf
	ssh -t root@${TGWTF_HOST} "systemctl enable tgwtf && systemctl reset-failed tgwtf && systemctl start tgwtf"
	ssh root@${TGWTF_HOST} "service tgwtf restart"
	-ssh root@${TGWTF_HOST} "sudo reboot"


docker-build:
	${DOCKER} build -t tgwtf .

docker-run: docker-build
	${DOCKER} run -it --rm -p 8080:8080 tgwtf

docker-deploy: docker-build
	@if [ -z ${TGWTF_HOST} ]; then echo "Please set TGWTF_HOST environment variable" && exit 255; fi
	${DOCKER} run -it --rm  -e "TGWTF_HOST=${TGWTF_HOST}" tgwtf deploy

docker-shell: 
	${DOCKER} run -it --rm -v${SOURCE_DIR}:/workdir --entrypoint=/bin/bash tgwtf
