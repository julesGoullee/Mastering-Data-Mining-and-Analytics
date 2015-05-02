'use strict';

var twtClient = require('./twitterConnector.js').client();
var config = require('../../config/config.js');
var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var esClient = esConnector.client();
var clientNotifier = require('../clientNotifier/clientNotifier.js');
var Table = require('cli-table');

var isReady = true;
var onStack = false;

function esData ( author, lang, content){
    return  {
        index: 'twitter',
        type: 'tweet',
        body: {
            title: "tweet",
            tags: config.TwitterKeyWord,
            author: author,
            lang: lang,
            date: Date.now(),
            content: content
        }
    }
}
var callbackOnNewTweet = function(){
    isReady = true;

    if( onStack && isReady) {
        onStack = false;
        isReady = false;
        clientNotifier.onNewTweet(callbackOnNewTweet);
    }
};

module.exports = {

    start: function(){
        esConnector.dropIndex().then(function( response, error ){

            twtClient.stream( 'statuses/filter', {track: config.TwitterKeyWord },  function( stream ){

                stream.on('data', function( tweet ) {

                    if( typeof tweet.text === "string" && tweet.lang === "en") {

                        var promiseCreate = esClient.create( esData(tweet.user.name, tweet.lang, tweet.text ));

                        promiseCreate.then(function (response, error) {

                            if (error) {
                                console.log(error);
                            }
                            else{

                                if( isReady ){
                                    isReady = false;
                                    onStack = false;
                                    clientNotifier.onNewTweet(callbackOnNewTweet);
                                }
                                else{
                                    onStack = true;
                                }
                            }
                        });
                    }
                    else{
                        //debugger;
                    }
                });

                stream.on('error', function(error) {
                    debugger;
                });
            });
        });

    }
};
