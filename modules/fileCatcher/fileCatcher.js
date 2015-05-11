"use strict";

var fs = require("fs");
var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var esClient = esConnector.client();
var config = require('../../config/config.js');
var clientNotifier = require('../clientNotifier/clientNotifier.js');
var text = fs.readFileSync(__dirname + "/marine").toString();
var phrases = text.split( "," );

var counter = 0;

function esData( content ){
    return  {
        index: 'twitter',
        type: 'tweet',
        body: {
            title: "tweet",
            tags: config.TwitterKeyWord,
            date: Date.now(),
            content: content
        }
    }
}

module.exports = {
    start : function( time ){
        esConnector.dropIndex().then(function( response, error ) {
            setInterval(function(){
                if( counter < phrases.length ){
                    var promiseCreate = esClient.create( esData(phrases[counter]) );
                    counter++;

                    promiseCreate.then( function( response, error ) {
                        clientNotifier.onNewTweet(function(){});
                    });
                }
            }, time );
        });
    }
};