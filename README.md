# WTF (Where is The Fun?)

## Getting started

The easies way to get started is to use Docker. Install Docker (`sudo apt-get install docker.io` on Ubuntu<sup>1</sup>, or download and run installers for [Mac](https://www.docker.com/docker-mac) or [Windows](https://www.docker.com/docker-windows)), then type:

```shell
	# check out and build
	git clone git@gitlab.com:technogecko/tgwtf.git
	cd tgwtf
	docker build -t tgwtf .

	# run
	docker run -it --rm -p 8080:8080 tgwtf
	open http://<docker machine ip address>:8080

	# get a shell
	docker run -it --rm  -e "TGWTF_HOST=wtf01" bash
```

Then open web browser and navigate to http://localhost:8080 - you should see the map.

<sup>1</sup> Ubuntu 18.04 LTE or later. If you're using an older version look up the appropriate commands.

## Setting up Raspberry Pi box

TODO: Write real instructions here
<!-- Check /etc/xdg/openbox/autostart file and make sure Chromium is started with 'http://localhost:8080',
not 'file:///opt/wtf/live/index.html'. Also run `service lighthttpd disable`
 -->

```shell
	# setup WTF on wtf01 box
	docker run -it --rm  -e "TGWTF_HOST=wtf01" tgwtf setup
```

- Follow https://www.raspberrypi.org/documentation/installation/installing-images/mac.md (used the "(Mostly) graphical interface" instructions)

- Download image from https://www.raspberrypi.org/downloads/raspbian/

- boot pi after plugging in keyboard, mouse, HDMI, and power

- Select timezone, and country, etc as prompted

- use password "otto" because its standard

- setup wifi with Nuvation wifi AP "SecondDetour" with password "TheRoadLessTraveled"

- update the software

- reboot!

- Setup kiosk mode https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/

- enable ssh
    - sudo raspi-config
    - enable SSH via "Interfacing Options", then "SSH", then select "Yes"



## Deploying

Connect to TechnoGecko WiFi network and type:

```shell
	# update WTF on wtf01 box
	docker run -it --rm  -e "TGWTF_HOST=wtf01" tgwtf deploy
```
