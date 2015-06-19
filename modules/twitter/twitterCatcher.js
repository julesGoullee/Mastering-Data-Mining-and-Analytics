'use strict';

var twtConnector = require("./twitterConnector.js");
var esConnector = require("../elasticSearch/elasticSearchConnector.js");


var callbackOnNewTweet = function( keyWord ){
    keyWord.isReady = true;

    if( keyWord.onStack && keyWord.isReady) {
        keyWord.onStack = false;
        keyWord.isReady = false;
        keyWord.onNewTweet(callbackOnNewTweet);
    }
};

module.exports = {

    trackKeyWord: function( keyWord, user ) {
        keyWord.isReady = true;
        keyWord.onStack = false;

        if( keyWord.tweetCount === 0){//premier lancement du mot

            esConnector.dropIndexByTag( keyWord.name );
        }

        twtConnector.onData( keyWord, user, function( tweet ){

            if( typeof tweet.text === "string" ){
                if( !tweet.retweeted_status ) {
                    esConnector.addNewEntry(keyWord, tweet.id_str, tweet.text, tweet.user.screen_name).then(function () {
                        if (keyWord.isReady) {
                            keyWord.isReady = false;
                            keyWord.onStack = false;
                            keyWord.onNewTweet(callbackOnNewTweet, tweet.text);
                        }
                        else {
                            keyWord.onStack = true;
                        }
                    });
                }
            }
            else {
                //debugger;
            }
        });
    },
    mock: function( mockTwtConnector, mockEsConnector ){
        twtConnector = mockTwtConnector;
        esConnector = mockEsConnector;
    }
};
