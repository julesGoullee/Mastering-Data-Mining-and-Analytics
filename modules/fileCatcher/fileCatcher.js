"use strict";

var fs = require("fs");
var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var clientNotifier = require('../clientNotifier/clientNotifier.js');
var text = fs.readFileSync(__dirname + "/marine").toString();
var phrases = text.split( "," );

var counter = 0;



module.exports = {
    start : function( time ){
        esConnector.dropIndexByTag().then(function() {
            setInterval(function(){
                if( counter < phrases.length ){
                    counter++;

                    esConnector.addNewEntry( phrases[counter] ).then( function() {
                        clientNotifier.onNewTweet(function(){});
                    });
                }
            }, time );
        });
    }
};