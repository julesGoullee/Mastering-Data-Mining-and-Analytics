#!/bin/bash

# Stopping servers
echo -e "\n\nStopping servers..."

sudo /etc/init.d/elasticsearch stop

killall mongod

forever stop bin/www.js
