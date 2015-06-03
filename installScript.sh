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

echo -e  "\n\n Add elasticsearch && mongodb in source apt.list"
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb http://packages.elastic.co/elasticsearch/1.5/debian stable main" | sudo tee -a /etc/apt/sources.list
echo "deb http://repo.mongodb.org/apt/debian "$(lsb_release -sc)"/mongodb-org/3.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

sudo apt-get update
sudo apt-get install git -y
git clone https://github.com/julesGoullee/Mastering-Data-Mining-and-Analytics.git
cd Mastering-Data-Mining-and-Analytics

echo -e  "\n\nInstalling elasticsearch mongodb essentials from package manager"
sudo apt-get install elasticsearch mongodb-org build-essential curl openjdk-7-jre -q -y

echo -e  "\n\nInstalling NodeJS..."
#Install nvm au lieu de la compilation node des sources
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
. $HOME/.nvm/nvm.sh
nvm install $nodeVersion
nvm use "v"$nodeVersion
echo "nvm use "$nodeVersion >> ~/.bashrc

echo -e  "\n\nStart service mongodb & elsticsearch"
sudo service mongod start
sudo service elasticsearch start

echo -e "\n\nInstalling npm globals..."
npm install -g grunt-cli
npm install -g bower
npm install -g forever

echo -e "\n\nInstalling dependencies..."
npm install
grunt config_dev


# MDMA Configuration
echo -e "\n\nConfiguring project..."

echo -e "\n\nDone !"

# TODO :
# launch mongodb at start
# todo launch mongodb as mongodb and set permissions
