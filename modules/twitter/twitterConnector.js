"use strict";

var twitter = require('twitter');

var jf = require('jsonfile');
var accounts = jf.readFileSync( __dirname + "/../../config/account.json");

module.exports = {
    client : function(){
        return client;
    },
    onData: function( keyWord, user, callback ){
        user.client = user.client || new twitter({
            consumer_key: accounts.TWITTER_CONSUMER_KEY,
            consumer_secret: accounts.TWITTER_CONSUMER_SECRET,
            access_token_key: user.session.token,
            access_token_secret: user.session.tokenSecret
        });

        user.client.stream( 'statuses/filter', {track: keyWord.name },  function( stream ){
            stream.on('data', function( tweet ){
                if( keyWord.stream === false ){
                    console.log("pause");
                    stream.destroy();
                    return false;
                }
                callback( tweet );
            });

            stream.on('error', function( error ){
                user.client.get("application/rate_limit_status", function( error, content, response ){
                    var limit = response.headers["x-rate-limit-reset"];
                    console.log("ban pour le mot" + keyWord.name + " reviens dans" + new Date(limit*1000) );
                    stream.destroy();
                    keyWord.pause();
                });
            });
        });
    }
};