"use strict";

var socketHandler = require("../socketHandler/socketHandler.js");
var esConnector = require("../elasticSearch/elasticSearchConnector.js");
var Representation = require("../representation/representation.js");
var utils = require("../utils/utils.js");

function KeyWord( name, lang, occurence, userOwner ){

    var self = this;
    self.name = name;
    self.lang = lang;
    self.stream = true;
    self.isWait = false;
    self.occurence = occurence;
    self.id = utils.guid();
    self.tweetCount = 0;
    self.representation = Representation( self.name );
    self.userOwner = userOwner;

    self.onNewTweet =  function( callback ) {
        self.tweetCount++;//TODO

        socketHandler.notifyInRoom( self.id, "tweetCount", self.tweetCount );

        esConnector.searchNewKeysWords( self, getRegexWordsAlreadyFlag(), function( newKeysWords ) {
            if( newKeysWords.length > 0 ){

                var tabKeysWords = [];
                for( var i = 0; i < newKeysWords.length; i++ ){

                    (function (i) {

                        esConnector.getKeysWordsReferences( self, newKeysWords[i].key, getRegexWordsAlreadyFlag(), function( keyWordsReferences ) {

                            tabKeysWords.push({
                                keyWord: newKeysWords[i].key,
                                occurence: newKeysWords[i].occurence,
                                references: keyWordsReferences
                            });

                            if (i === newKeysWords.length - 1) {

                                self.representation.addKeysWords( tabKeysWords, function ( keysWordObjects ) {
                                    socketHandler.notifyInRoom( self.id, "newWord", keysWordObjects );
                                    callback( self );
                                });
                            }
                        });

                    }(i));
                }

            } else {
                callback( self );
            }
        });
    };

    self.pause = function(){
        self.stream = false;
        self.isWait = true;
    };

    self.resume = function(){
        self.stream = true;
        self.isWait = false;
    };

    self.mock = function( mockSocketHandler, mockEsConnector ){
        socketHandler = mockSocketHandler;
        esConnector = mockEsConnector;
    };

    self.getTweetByWord = function( keyWord, word, callback ){
        esConnector.getTweetByWord( keyWord, word, callback);
    };

    function getRegexWordsAlreadyFlag(){

        var words = self.representation.getWordsAlreadyFlag();

        var regex = "";

        for( var i = 0 ; i < words.length ; i++ ){
            if( i !== 0 ){
                regex += "|";
            }
            regex += words[i] ;
        }
        return regex;
    }
}

module.exports= function( name, lang, occurence, userOwner ){
    return new KeyWord( name, lang, occurence, userOwner );
};