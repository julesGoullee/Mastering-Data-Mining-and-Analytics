"use strict";

var elasticsearch = require('elasticsearch');
var config = require('../../config/config.js');

var client = new elasticsearch.Client({
    host: config.elasticSearchAddr
});

client.ping({
    requestTimeout: 6000,
    hello: "elasticsearch!"
}, function ( error ) {

    if( error ) {

        console.trace('Elasticsearch cluster is down!');
    }else {

        console.log('Elasticsearch ping [OK]');
    }
});


module.exports = {
    client : function(){
        return client;
    },
    dropIndexByTag: function(){
        var promiseDelete  = client.deleteByQuery({
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

        promiseDelete.then(function( response, error ){

            if( error ){
                console.trace( error );
            }
        });
        return promiseDelete;
    },
    addNewEntry : function( content ){

        var promiseCreate = client.create({
            index: 'twitter',
            type: 'tweet',
            body: {
                tags: config.TwitterKeyWord,
                date: Date.now(),
                lang: config.lang,
                content: content
            }
        });

        promiseCreate.then(function( response, error ){

            if( error ) {
                console.trace( error );
            }
        });

        return promiseCreate;
    }
};


