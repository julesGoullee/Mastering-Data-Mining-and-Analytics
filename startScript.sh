#!/bin/bash

# Starting servers
echo -e "\n\nStarting servers..."

sudo /etc/init.d/elasticsearch start

mongod --dbpath mongodb/data/db&

npm start
