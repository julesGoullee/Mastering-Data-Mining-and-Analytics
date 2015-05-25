"use strict";

var twitter = require('twitter');

var config = require('../../config/config.js');




module.exports = {
    client : function(){
        return client;
    },
    onData: function( twitterKeyWord, callback ){
        var client = new twitter({
            consumer_key: "7ZkuNkslxLXJReFnZXQiQQYmi",
            consumer_secret: "RaOlbMXzUAhParwL95X9VWQ4j2JEjDvctiAVhnW0LjBBsRGJbM",
            access_token_key: "1068441726-aJMFtZQgTLP8vljzW2XkUsPoISReoAmnXGfycYd",
            access_token_secret: "moTV1xg2RTlQe3fzENn0SeMAnfj0fP8sMNeDfONDAaEbC"
        });
        client.stream( 'statuses/filter', {track: twitterKeyWord },  function( stream ) {

            stream.on('data', function ( tweet ) {
                callback( tweet );
            });

            stream.on('error', function(error) {
                console.trace( error );
            });
        });
    }
};