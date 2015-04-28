"use strict";

var twitter = require('twitter');

var client = new twitter({
    consumer_key: "7ZkuNkslxLXJReFnZXQiQQYmi",
    consumer_secret: "RaOlbMXzUAhParwL95X9VWQ4j2JEjDvctiAVhnW0LjBBsRGJbM",
    access_token_key: "1068441726-LzsbGEBUWNPoKHyJRMjVCMBLN6T3T9g8nkJrvcK",
    access_token_secret: "rNz13tQIIpat5j4vVUDzzgxXcjQzVrUNyuWbLI6mtjmAX"
});


module.exports = {
    client : function(){
        return client;
    }
};