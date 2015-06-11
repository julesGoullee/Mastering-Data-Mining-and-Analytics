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
        esConnector.dropIndexByTag( keyWord.name );

        twtConnector.onData( keyWord, user, function ( tweet ){

            if( typeof tweet.text === "string" ) {
                esConnector.addNewEntry( keyWord, tweet.text ).then( function (){
                    if( keyWord.isReady ){
                        keyWord.isReady = false;
                        keyWord.onStack = false;
                        keyWord.onNewTweet( callbackOnNewTweet );
                    }
                    else {
                        keyWord.onStack = true;
                    }
                });
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
