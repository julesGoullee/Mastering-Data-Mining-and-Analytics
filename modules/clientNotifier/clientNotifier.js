"use strict";

var esConnector = require('../elasticSearch/elasticSearchConnector.js');
var esClient = esConnector.client();
var config = require('../../config/config.js');
var Table = require('cli-table');
var socketHandler = require('../socketHandler/socketHandler.js');
var tweetCount = 0;
var representation = require('../representation/representation.js');

var reqSetting = {
    //"analysis": {
    //    "filter": {
    //        "english_stop": {
    //            "type":       "stop",
    //            "stopwords":  "_english_"
    //        },
    //        "english_keywords": {
    //            "type":       "keyword_marker",
    //            "keywords":   []
    //        },
    //        "english_stemmer": {
    //            "type":       "stemmer",
    //            "language":   "english"
    //        },
    //        "english_possessive_stemmer": {
    //            "type":       "stemmer",
    //            "language":   "possessive_english"
    //        }
    //    },
    //    "analyzer": {
    //        "english": {
    //            "tokenizer":  "standard",
    //            "filter": [
    //                "english_possessive_stemmer",
    //                "lowercase",
    //                "english_stop",
    //                "english_keywords",
    //                "english_stemmer"
    //            ]
    //        }
    //    }
    //}
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
};

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

function getKeysWordsReferences( word, callaback ){
    var req = esClient.search({
        index: "twitter",
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            match: {
                                tags: config.TwitterKeyWord
                            }
                        },
                        {
                            match: {
                                content: word
                            }
                        }
                    ]
                }
            },
            aggs: {
                keyWords: {
                    terms: {
                        field: "content",
                        "include" : {
                            "pattern" : getRegexWordsAlreadyFlag()
                            //"flags" : "CASE_INSENSITIVE"
                        },
                        "size": 1000
                    }
                }
            }
        },
        size: 1000,
        "settings": reqSetting
    });

    req.then( function ( resp ) {

        //var hits = resp.hits.hits;
        var aggr = resp.aggregations.keyWords.buckets;

        var tab = [];

        for( var i = 0; i < aggr.length; i++ ){

            tab.push(aggr[i].key);
        }

        callaback( tab );

    }, function ( err ) {
        console.trace( err.message );
    });
}

function searchNewKeysWords( callaback ){

    var req = esClient.search({
        index: "twitter",
        body:{
            query: {
                match: {
                    tags: config.TwitterKeyWord
                }
            },
            aggs: {
                keyWords: {
                    terms: {
                        field: "content",
                        "exclude" : {
                            "pattern" : getRegexWordsAlreadyFlag()
                            //"flags" : "CASE_INSENSITIVE"
                        },
                        min_doc_count: config.minOccurence,
                        "size" : 1000
                    }
                }
            }
        },
        size: 1000,
        "settings": reqSetting
    });

    req.then( function ( resp ) {

        var hits = resp.hits.hits;
        var aggr = resp.aggregations.keyWords.buckets;

        var keysWords = [];
        for( var i = 0; i < aggr.length; i++ ){

            if( aggr[i].key.length > 4){

                keysWords.push({
                    key : aggr[i].key,
                    occurence: aggr[i].doc_count
                });

            }
        }

        callaback( keysWords );

    }, function ( err ) {
        console.trace( err.message );
    });
}

module.exports = {
    onNewTweet : function( callback ){

        tweetCount++;

        socketHandler.notifyAll("tweetCount", tweetCount);

        searchNewKeysWords(function( newKeysWords ){

            if( newKeysWords.length > 0 ){

                var tabKeysWords = [];

                for ( var i = 0 ; i < newKeysWords.length; i++ ){

                    (function(i){

                        getKeysWordsReferences( newKeysWords[i].key, function( keyWordsReferences ){

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