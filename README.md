WTF Kiosk Setup
================

Before installation ensure that you have fishlight deployment keys on the system and install dfaprs
as described in its repo

Installation 
-------------
Serial configuration with the daemon managed by upstartd:

    sudo apt-get install -y git
    sudo apt-get install -y make
    sudo apt-get install -y nginx

	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs

    git clone https://gitlab.com/discofish/dfwtf
    cd dfwtf
    make 
    sudo make install
 