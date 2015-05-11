'use strict';

var twtConnector = require('./twitterConnector.js');
var config = require('../../config/config.js');
var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var clientNotifier = require('../clientNotifier/clientNotifier.js');

var isReady = true;
var onStack = false;

var callbackOnNewTweet = function(){
    isReady = true;

    if( onStack && isReady) {
        onStack = false;
        isReady = false;
        clientNotifier.onNewTweet(callbackOnNewTweet);
    }
};

module.exports = {

    start: function() {
        esConnector.dropIndexByTag().then(function(){
            twtConnector.onData(function ( tweet ){

                if (typeof tweet.text === "string" && ( (config.filterLang && config.lang === tweet.lang) || config.filterLang === false)) {

                    esConnector.addNewEntry(tweet.text).then(function () {

                        if (isReady) {
                            isReady = false;
                            onStack = false;
                            clientNotifier.onNewTweet(callbackOnNewTweet);
                        }
                        else {
                            onStack = true;
                        }
                    });
                }
                else {
                    //debugger;
                }
            });
        });
    }
};
