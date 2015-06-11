"use strict";

var twitter = require('twitter');

var jf = require('jsonfile');
var accounts = jf.readFileSync( __dirname + "/../../config/account.json");

module.exports = {
    client : function(){
        return client;
    },
    onData: function( twitterKeyWord, tokens, callback ){
        var client = new twitter({
            consumer_key: accounts.TWITTER_CONSUMER_KEY,
            consumer_secret: accounts.TWITTER_CONSUMER_SECRET,
            access_token_key: tokens.token,
            access_token_secret: tokens.tokenSecret
        });
        client.stream( 'statuses/filter', {track: twitterKeyWord },  function( stream ){

            stream.on('data', function( tweet ){
                callback( tweet );
            });

            stream.on('error', function( error ){
                client.get("application/rate_limit_status", function( error, content, response ){
                    var limit = response.headers["x-rate-limit-reset"];
                    console.log("ban pour le mot" + twitterKeyWord + " reviens dans" + new Date(limit*1000) );
                });
            });
        });
    }
};