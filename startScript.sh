#!/bin/bash

# Starting servers
. $HOME/.bashrc

echo -e "\n\nStarting servers..."

sudo service mongod start
sudo service elasticsearch start

forever start bin/www.js
