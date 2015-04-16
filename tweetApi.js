"use strict";

var elasticsearch = require('elasticsearch');
var elasticsearchClient = new elasticsearch.Client({
    host: '192.168.56.102:9200'
    //log: 'trace'
});

var Table = require('cli-table');

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: "7ZkuNkslxLXJReFnZXQiQQYmi",
    consumer_secret: "RaOlbMXzUAhParwL95X9VWQ4j2JEjDvctiAVhnW0LjBBsRGJbM",
    access_token_key: "1068441726-LzsbGEBUWNPoKHyJRMjVCMBLN6T3T9g8nkJrvcK",
    access_token_secret: "rNz13tQIIpat5j4vVUDzzgxXcjQzVrUNyuWbLI6mtjmAX"
});

var track = 'trackhastag';

client.stream('statuses/filter', {track: track},  function( stream ){



    stream.on('data', function(tweet) {


        if( typeof tweet.text === "string" ) {

            var table = new Table({
                head: ['authors', 'tweet'],
                colWidths: [20, 150]
            });
            table.push([tweet.user.name,  tweet.text]);
            console.log(table.toString());

            var data = {
                index: 'twitter',
                type: 'tweet',
                body: {
                    title: "tweet",
                    tags: track,
                    author: tweet.user.name,
                    lang: tweet.lang,
                    content: tweet.text
                }
            };

            elasticsearchClient.create(data, function (error, response) {
                if (error) {
                    console.trace('elasticsearch cluster is down! ' + error);
                } else {
                    //console.log('All is well' + JSON.stringify(response));
                }
            });
        }
        else{
            debugger;
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});