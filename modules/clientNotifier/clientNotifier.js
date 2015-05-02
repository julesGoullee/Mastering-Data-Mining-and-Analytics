"use strict";

var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var esClient = esConnector.client();
var config = require('../../config/config.js');
var Table = require('cli-table');
var socketHandler = require('../socketHandler/socketHandler.js');

function search( callaback ){

    var req = esClient.search({
        index: "twitter",
        body:{
            query: {
                match: {
                    tags: config.TwitterKeyWord
                }
            },
            aggs: {
                test: {
                    terms: {
                        field: "content",
                        min_doc_count: 3,
                        "size" : 1000
                    }
                }
            }
        },
        size: 1000,
        "settings": {
            "analysis": {
                "filter": {
                    "french_elision": {
                        "type":         "elision",
                        "articles": [ "l", "m", "t", "qu", "n", "s",
                            "j", "d", "c", "jusqu", "quoiqu",
                            "lorsqu", "puisqu"
                        ]
                    },
                    "french_stop": {
                        "type":       "stop",
                        "stopwords":  "_french_"
                    },
                    "french_keywords": {
                        "type":       "keyword_marker",
                        "keywords":   []
                    },
                    "french_stemmer": {
                        "type":       "stemmer",
                        "language":   "light_french"
                    }
                },
                "analyzer": {
                    "french": {
                        "tokenizer":  "standard",
                        "filter": [
                            "french_elision",
                            "lowercase",
                            "french_stop",
                            "french_keywords",
                            "french_stemmer"
                        ]
                    }
                }
            }
        }
    });

    req.then( function ( resp ) {

        var hits = resp.hits.hits;
        var aggr = resp.aggregations.test.buckets;

        var table = new Table({
            head: ['keyword', 'Occurrence'],
            colWidths: [20, 20]
        });
        var tab = [];
        for( var i = 0; i < aggr.length; i++ ){

            if( aggr[i].key.length > 4){
            tab.push([aggr[i].key + " " + aggr[i].doc_count]);
            table.push([aggr[i].key,  aggr[i].doc_count]);
            }
        }
        callaback( tab );
        console.log(table.toString());


    }, function ( err ) {
        console.trace( err.message );
    });
}

module.exports = {
    onNewTweet : function(){
        if( socketHandler.getNbSockets() > 0 ){
            search(function( data ){
                socketHandler.notifyAll("newRepresentation" , data );

            });
        }
    },
    getNewConnection : function(){

        socketHandler.onNewConnection(function( socket ){

            search(function( data ){

                socketHandler.notifyOne("newRepresentation" , data, socket );

            });
        })
    }
};