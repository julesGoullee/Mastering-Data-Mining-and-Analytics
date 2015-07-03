#!/bin/bash

# Starting servers
. $HOME/.bashrc

echo -e "\n\nStarting servers..."

sudo service mongod start
sudo service elasticsearch start


echo -e "\n\nStarting node app..."
forever start bin/www.js
echo -e "\n\nDone !"
