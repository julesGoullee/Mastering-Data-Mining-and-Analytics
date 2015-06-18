Mastering-Data-Mining-and-Analytics
==========
Tweet tracker

Nodejs-Express-socketio web app
Storage mongdb & elasticSearch
Angularjs,D3 client app

[Demo dev](http://masteringdata.ddns.net)

### Test && Build
[![Build Status](https://travis-ci.org/julesGoullee/Mastering-Data-Mining-and-Analytics.png)](https://travis-ci.org/julesGoullee/Mastering-Data-Mining-and-Analytics)

## Configuration
Default configuration installs everythings needed to run the web application server.

However, if you want to run ElasticSearch server on another machine, please set its IP at the beginning of installScript.sh.

Files in config/ must be tweaked to use your own configurations, like twitter API keys and no-ip credentials.

## Installation :

```
wget -q https://raw.githubusercontent.com/julesGoullee/Mastering-Data-Mining-and-Analytics/master/scripts/installScript.sh
chmod u+x installScript.sh
./installScript.sh
```
