#!/bin/bash

# Stopping servers
echo -e "\n\nStopping servers..."

echo -e "\n\nStopping service..."
sudo service mongod start
sudo service elasticsearch start

echo -e "\n\nStopping node app..."

forever stop bin/www.js

echo -e "\n\nDone !"