"use strict";

var twitter = require('twitter');

var jf = require('jsonfile');
var accounts = jf.readFileSync( __dirname + "/../../config/account.json");
var socketHandler = require("../socketHandler/socketHandler.js");
var utils = require("../utils/utils.js");


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
                    stream.destroy();
                    return false;
                }
                callback( tweet );
            });

            stream.on('error', function( error ){
                user.client.get("application/rate_limit_status", function( error, content, response ){
                    var limit = response.headers["x-rate-limit-reset"];
                    var timeRemaining = new Date(limit*1000);

                    console.log( "ban pour le mot '" + keyWord.name + "' jusqu'a " + utils.dateToString( timeRemaining ) );
                    stream.destroy();
                    keyWord.pause();

                    //socketHandler.notifyAllInRoomWithoutMe( keyWord.id, "pauseKeyWord", keyWord.id, user.socket );
                    console.log(utils.dateToString(timeRemaining));
                    socketHandler.notifyOne( "limitExceeded", {
                        id: keyWord.id,
                        timeRemaining : timeRemaining.getTime()
                    }, user.socket );
                });
            });
        });
    }
};