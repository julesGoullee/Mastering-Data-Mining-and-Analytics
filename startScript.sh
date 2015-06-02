#!/bin/bash

# Starting servers
source $HOME/.bashrc

echo -e "\n\nStarting servers..."

sudo /etc/init.d/elasticsearch start

mongod --dbpath mongodb/data/db&

forever start bin/www.js
