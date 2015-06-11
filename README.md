Bridge between APRS TNC and BRCMap server
=========================================

Before installation ensure that you have dfaprs deployment keys on the system.

Installation (Ubuntu)
---------------------

This example shows installation in serial configuration with the daemon
managed by upstartd.

    sudo apt-get install -y git
    sudo apt-get install -y make
	sudo apt-get install -y python-setuptools
	sudo easy_install pip
	sudo pip install virtualenv
    git clone --depth=1 git@bitbucket.org:discofish/dfaprs.git dfaprs
    cd dfaprs
    make 
    sudo make install
    sudo echo 'description "APRS to BRC Map bridge"
		author      "dmitry@azovtsev.com"

		start on runlevel [2345]
		stop on runlevel [!2345]

		expect fork

		respawn
		respawn limit 5 5

		script
		    export HOME=/root
		    chdir $HOME
		    exec /usr/bin/dfaprs --source="serial:///dev/ttyUSB*" --target=http://localhost:8091 2>&1 | logger -t dfaprs &
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
	' > /etc/init/dfaprs.conf
	sudo initctl reload-configuration
	sudo service dfaprs start 
	sudo tail -f /var/log/syslog

Installation (CentOS) 
----------------------

This example shows intallation in network configuration with the daemon managed 
by systemd.

    sudo yum install -y git
    sudo yum install -y make
	sudo yum install -y python-setuptools
	sudo easy_install pip
	sudo pip install virtualenv
    git clone --depth=1 git@bitbucket.org:discofish/dfaprs.git dfaprs
    cd dfaprs
    make 
    sudo make install
    sudo echo 'Description=APRS to BRC Map bridge

		[Service]
		ExecStart=/usr/bin/dfaprs --source=aprs://noam.aprs2.net --target=http://localhost:8091
		Restart=always
		StandardOutput=syslog
		SyslogIdentifier=dfaprs
		User=nobody
		Group=nobody
		WorkingDirectory=/root

		[Install]
		WantedBy=multi-user.target
	' > /usr/lib/systemd/system/dfaprs.service
	systemctl enable dfaprs
	systemctl start dfaprs
	tail -f /var/log/messages

To update:
	
	systemctl daemon-reload
	systemctl reset-failed dfaprs
	systemctl restart dfaprs
