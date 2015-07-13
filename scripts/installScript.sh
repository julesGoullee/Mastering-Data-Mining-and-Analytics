#!/bin/bash

##Choose install
instMongo=true
instES=true
instNode=true
## Config
nodeVersion=0.12.4

## Script

echo -e "\n- Mastering Data Mining and Analytics installation. -\n\nYou will need sudo and be prompted for root password. It will break your system and send us all of your passwords.\n-------------"

echo -e "\n Update source"
sudo apt-get install git curl -y


if ${instES}; then
    echo -e  "\n\n Add Elasticsearch in source apt.list"
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
    echo "deb http://packages.elastic.co/elasticsearch/1.5/debian stable main" | sudo tee -a /etc/apt/sources.list
fi

if ${instMongo}; then
    echo -e  "\n\n Add mongodb in source apt.list"
    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
fi

sudo apt-get update
sudo apt-get install git -y
git clone https://github.com/julesGoullee/Mastering-Data-Mining-and-Analytics.git
cd Mastering-Data-Mining-and-Analytics

echo -e  "\n\nInstalling elasticsearch mongodb essentials from package manager"

if ${instES}; then
    sudo apt-get install mongodb-org
fi

if ${instMongo}; then
    sudo apt-get install elasticsearch openjdk-7-jre -q -y
fi

if ${instNode}; then
    echo -e  "\n\nInstalling NodeJS..."
    #Install nvm au lieu de la compilation node des sources
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash
    . $HOME/.nvm/nvm.sh
    nvm install ${nodeVersion}
    nvm use "v"${nodeVersion}
    echo "nvm use "${nodeVersion}" > /dev/null 2>&1" >> ~/.bashrc
fi

echo -e "\n\nInstalling npm globals..."
npm install -g grunt-cli
npm install -g bower
npm install -g forever

# MDMA Configuration
echo -e "\n\nConfiguring project..."
npm install
grunt config_dev
echo -e "\n\nDone !"

# todo launch mongodb as mongodb and set permissions
