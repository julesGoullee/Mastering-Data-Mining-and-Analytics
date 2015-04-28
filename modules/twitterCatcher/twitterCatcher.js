'use strict';

var twtClient = require('./twitterConnector.js').client();
var config = require('../../config/config.js');
var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var esClient = esConnector.client();
var clientNotifier = require('../clientNotifier/clientNotifier.js');
var Table = require('cli-table');

function esData ( author, lang, content){
    return  {
        index: 'twitter',
        type: 'tweet',
        body: {
            title: "tweet",
            tags: config.TwitterKeyWord,
            author: author,
            lang: lang,
            content: content
        }
    }
}


module.exports = {

    start: function(){

        twtClient.stream( 'statuses/filter', {track: config.TwitterKeyWord },  function( stream ){

            stream.on('data', function( tweet ) {

                if( typeof tweet.text === "string" ) {

                    /*var table = new Table({
                        head: ['authors', 'tweet'],
                        colWidths: [20, 150]
                    });
                    table.push([tweet.user.name,  tweet.text]);
                    console.log(table.toString());
                    */

                    esClient.create( esData(tweet.user.name, tweet.lang, tweet.text ), function (error, response) {

                        if (error) {
                            debugger;
                        }
                        else{
                            clientNotifier.onNewTweet();
                        }
                    });
                }
                else{
                    debugger;
                }
            });

            stream.on('error', function(error) {
                debugger;
            });
        });
    }
};
