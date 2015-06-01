#!/bin/bash
## Config

ES_Server=0
ESVersion=1.5.2
nodeVersion=0.12.4
mongoVersion=3.0.3
startOnBoot=false
start=false

## Script

echo -e "\n- Mastering Data Mining and Analytics installation. -\n\nYou will need sudo and be prompted for root password. It will break your system and send us all of your passwords.\n-------------"

sudo apt-get update
sudo apt-get install git -y
git clone https://github.com/julesGoullee/Mastering-Data-Mining-and-Analytics.git
cd Mastering-Data-Mining-and-Analytics

echo -e  "\n\nInstalling essentials from package manager"
sudo apt-get install git curl openjdk-7-jre -q -y

echo -e  "\n\nInstalling NodeJS..."
#Install nvm au lieu de la compilation node des sources
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
. $HOME/.nvm/nvm.sh
nvm install $nodeVersion
nvm use "v"$nodeVersion
echo "nvm use "$nodeVersion >> ~/.bashrc

echo -e  "\n\nInstalling MongoDB..."
curl -O http://downloads.mongodb.org/linux/mongodb-linux-x86_64-$mongoVersion.tgz
tar xfz mongodb-linux-x86_64-$mongoVersion.tgz
rm -rf mongodb-linux-x86_64-$mongoVersion.tgz
mkdir -p mongodb
mv mongodb-linux-x86_64-$mongoVersion/* mongodb
rm -r mongodb-linux-x86_64-$mongoVersion
cd mongodb

    if ! grep -qc 'mongodb/bin' "$HOME/.bashrc"; then
        echo "=> Appending source string to .bashrc"
        echo -e  'export PATH='`pwd`'/bin:$PATH' >> $HOME/.bashrc
    else
        echo "=> Source string already in b.bashrc"
    fi

export PATH=`pwd`/bin:$PATH
mkdir -p data/db
cd ..

if [ $ES_Server = 0 ]; then
echo -e  "\n\nInstalling ElasticSearch..."
curl -L -O https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-$ESVersion.deb
sudo dpkg -i elasticsearch-$ESVersion.deb
rm elasticsearch-$ESVersion.deb -f
sudo update-rc.d elasticsearch defaults 95 10
fi

echo -e "\n\nInstalling npm globals..."
npm install -g grunt-cli
npm install -g bower
npm install -g forever

echo -e "\n\nInstalling dependencies..."
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



echo -e "\n\nDone !"

# TODO :
# launch mongodb at start
# todo launch mongodb as mongodb and set permissions
