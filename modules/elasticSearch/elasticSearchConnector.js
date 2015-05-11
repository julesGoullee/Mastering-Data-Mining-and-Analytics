"use strict";

var elasticsearch = require('elasticsearch');
var config = require('../../config/config.js');

var client = new elasticsearch.Client({
    host: config.elasticSearchAddr
});
var reqSetting;

client.ping({
    requestTimeout: 6000,
    hello: "elasticsearch!"
}, function ( error ) {

    if( error ) {

        console.trace('Elasticsearch cluster is down!');
    }else {

        console.log('Elasticsearch ping [OK]');
    }
});

module.exports = {
    client : function(){
        return client;
    },
    dropIndexByTag: function(){
        var promiseDelete  = client.deleteByQuery({
            index: 'twitter',
            type: 'tweet',
            body: {
                query: {
                    match: {
                        tags: config.TwitterKeyWord
                    }
                }
            }
        });

        promiseDelete.then(function( response, error ){

            if( error ){
                console.trace( error );
            }
        });
        return promiseDelete;
    },
    addNewEntry : function( content ){

        var promiseCreate = client.create({
            index: 'twitter',
            type: 'tweet',
            body: {
                tags: config.TwitterKeyWord,
                date: Date.now(),
                lang: config.lang,
                content: content
            }
        });

        promiseCreate.then(function( response, error ){

            if( error ) {
                console.trace( error );
            }
        });

        return promiseCreate;
    },
    searchNewKeysWords : function( regexWordsAlreadyFlag, callback ){
        var req = client.search({
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
                                "pattern" : regexWordsAlreadyFlag
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

            callback( keysWords );

        }, function ( err ) {
            console.trace( err.message );
        });
    },
    getKeysWordsReferences: function( newKeysWord, regexWordsAlreadyFlag, callback ){
        var req = client.search({
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
                                    content: newKeysWord
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
                                "pattern" : regexWordsAlreadyFlag
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

            callback( tab );

        }, function ( err ) {
            console.trace( err.message );
        });
    }
};


if( config.lang === "en" ) {
    reqSetting = {
        "analysis": {
            "filter": {
                "english_stop": {
                    "type": "stop",
                    "stopwords": "_english_"
                },
                "english_keywords": {
                    "type": "keyword_marker",
                    "keywords": []
                },
                "english_stemmer": {
                    "type": "stemmer",
                    "language": "english"
                },
                "english_possessive_stemmer": {
                    "type": "stemmer",
                    "language": "possessive_english"
                }
            },
            "analyzer": {
                "english": {
                    "tokenizer": "standard",
                    "filter": [
                        "english_possessive_stemmer",
                        "lowercase",
                        "english_stop",
                        "english_keywords",
                        "english_stemmer"
                    ]
                }
            }
        }
    }
} else if( config.lang === "fr") {
    reqSetting = {
        "analysis": {
            "filter": {
                "french_elision": {
                    "type": "elision",
                    "articles": ["l", "m", "t", "qu", "n", "s",
                        "j", "d", "c", "jusqu", "quoiqu",
                        "lorsqu", "puisqu"
                    ]
                },
                "french_stop": {
                    "type": "stop",
                    "stopwords": "_french_"
                },
                "french_keywords": {
                    "type": "keyword_marker",
                    "keywords": []
                },
                "french_stemmer": {
                    "type": "stemmer",
                    "language": "light_french"
                }
            },
            "analyzer": {
                "french": {
                    "tokenizer": "standard",
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
}