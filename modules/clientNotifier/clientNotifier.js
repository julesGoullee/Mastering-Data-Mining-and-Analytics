"use strict";

var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var config = require('../../config/config.js');
var socketHandler = require('../socketHandler/socketHandler.js');
var tweetCount = 0;
var representation = require('../representation/representation.js')();

function getRegexWordsAlreadyFlag(){

    var words = representation.getWordsAlreadyFlag();

    var regex = "";

    for( var i = 0 ; i < words.length ; i++ ){
        if( i !== 0 ){
            regex += "|";
        }
        regex += words[i] ;
    }
    return regex;
}

module.exports = {
    onNewTweet : function( callback ){

        tweetCount++;

        socketHandler.notifyAll("tweetCount", tweetCount);

        esConnector.searchNewKeysWords(getRegexWordsAlreadyFlag(), function( newKeysWords ){

            if( newKeysWords.length > 0 ){

                var tabKeysWords = [];

                for ( var i = 0 ; i < newKeysWords.length; i++ ){

                    (function(i){

                        esConnector.getKeysWordsReferences( newKeysWords[i].key, getRegexWordsAlreadyFlag(), function( keyWordsReferences ){

                            tabKeysWords.push({
                                keyWord : newKeysWords[i].key,
                                occurence : newKeysWords[i].occurence,
                                references : keyWordsReferences
                            });

                            if( i === newKeysWords.length -1){

                                representation.addKeysWords( tabKeysWords, function( keysWordObjects ){
                                    socketHandler.notifyAll("newWord", keysWordObjects);
                                    callback();
                                });
                            }
                        });

                    }(i));
                }

            }else{
                callback();
            }

        });
    },
    getNewConnection : function(){

        socketHandler.onNewConnection(function( socket ){

            socketHandler.notifyOne("newRepresentation" , representation.getJson() , socket );
            socketHandler.notifyOne("tweetCount", tweetCount, socket);
        });
    }
};