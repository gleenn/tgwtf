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
```

Then open web browser and navigate to http://localhost:8080 - you should see the map.

<sup>1</sup> Ubuntu 18.04 LTE or later. If you're using an older version look up the appropriate commands.

## Setting up Raspberry Pi box

TODO: Write real instructions here
<!-- Check /etc/xdg/openbox/autostart file and make sure Chromiun is started with 'http://localhost:8080',
not 'file:///opt/wtf/live/index.html'. Also run `service lighthttpd disable`
 -->

```shell
	# setup WTF on wtf01 box
	docker run -it --rm  -e "TGWTF_HOST=wtf01" tgwtf setup
```

## Deploying

Connect to TechnoGecko WiFi network and type:

```shell
	# update WTF on wtf01 box
	docker run -it --rm  -e "TGWTF_HOST=wtf01" tgwtf deploy
```
