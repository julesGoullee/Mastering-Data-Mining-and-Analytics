"use strict";

var elasticsearch = require('elasticsearch');
var config = require('../../config/config.js');

var client = new elasticsearch.Client({
    host: config.elasticSearchAddr
});

client.ping({
    requestTimeout: 6000,
    hello: "elasticsearch!"
}, function (error) {
    if (error) {
        console.trace('Elasticsearch cluster is down!');
    } else {
        console.log('Elasticsearch ping [OK]');
    }
});

module.exports = {
    client : function(){
        return client;
    },
    dropIndexByTag: function(){
        return client.deleteByQuery({
            index: 'twitter',
            type: 'tweet',
            body: {
                query: {
                    match: {
                        tags: config.TwitterKeyWord
                    }
                }
            }
        });
    }
};


