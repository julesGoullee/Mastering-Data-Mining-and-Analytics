#!/bin/bash
## Config

ES_Server=0
ESVersion=1.5.2
nodeVersion=0.12.4
mongoVersion=3.0.3
startOnBoot=false
start=false

## Script

sudo apt-get install git -y
git clone https://github.com/julesGoullee/Mastering-Data-Mining-and-Analytics.git
cd Mastering-Data-Mining-and-Analytics

echo -e  "Installing essentials from package manager"
sudo apt-get update
sudo apt-get install build-essential git curl openjdk-7-jre -q -y

echo -e  "\n\nInstalling NodeJS..."
curl -L -O http://nodejs.org/dist/v0.12.4/node-v$nodeVersion.tar.gz
tar xfz node-v$nodeVersion.tar.gz
cd node-v$nodeVersion
sudo ./configure
sudo make
sudo make install
cd ..
rm -rf node-v$nodeVersion node-v$nodeVersion.tar.gz

echo -e  "\n\nInstalling MongoDB..."
curl -O http://downloads.mongodb.org/linux/mongodb-linux-x86_64-$mongoVersion.tgz
tar xfz mongodb-linux-x86_64-$mongoVersion.tgz
rm -rf mongodb-linux-x86_64-$mongoVersion.tgz
mkdir -p mongodb
mv mongodb-linux-x86_64-$mongoVersion/* mongodb
rm -r mongodb-linux-x86_64-$mongoVersion
cd mongodb
echo -e  'export PATH='`pwd`'/bin:$PATH' >> ~/.bashrc 
mkdir -p data/db
cd ..

if [ $ES_Server = 0 ]
then
echo -e  "\n\nInstalling ElasticSearch..."
curl -L -O https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$ESVersion.deb
sudo dpkg -i elasticsearch-$ESVersion.deb
rm elasticsearch-$ESVersion.deb -f
sudo update-rc.d elasticsearch defaults 95 10
fi

echo -e "\n\nInstalling npm globals..."
sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install -g forever

echo -e "\n\nUpdating repository."
git pull
npm install
grunt config_dev


# MDMA Configuration
echo -e "\n\nConfiguring project..."

es_ip=127.0.0.1
if [ $ES_Server != 0 ]
then 
es_ip=$ES_Server
fi

echo "'use strict';
module.exports = {
    minOccurence: 5,
    lang: 'fr',
    elasticSearchAddr: '"$es_ip":9200',
    domain:'twitmdma.ddns.net',
    port:3000
};" > config/config.js



echo -e "\n\nDone ! Everything went fine."

# TODO :
# launch mongodb at start
# todo launch mongodb as mongodb and set permissions
