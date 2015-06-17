"use strict";

var elasticsearch = require("elasticsearch");
var config = require("../../config/config.js");

var client = new elasticsearch.Client({
    host: config.api.esAddress
});

module.exports = {
    dropIndexByTag: function( keyWord ){
        try {
            var promiseDelete = client.deleteByQuery({
                index: "twitter",
                type: "tweet",
                body: {
                    query: {
                        match: {
                            tags: keyWord
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

        }
        catch(e ){

        }
    },
    addNewEntry : function( keyWord, content ){

        var promiseCreate = client.create({
            index: "twitter",
            type: "tweet",
            body: {
                tags: keyWord.name,
                date: Math.floor(new Date() / 1000),
                lang: keyWord.lang,
                content: content
            }
        });

        promiseCreate.then(function( response, error ){

            if( error ){
                console.trace( error );
            }
        });

        return promiseCreate;
    },
    searchNewKeysWords : function( keyWord, regexWordsAlreadyFlag, callback ){
        var req = client.search({
            index: "twitter",
            body:{
                query: {
                    match: {
                        tags: keyWord.name
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
                            min_doc_count: keyWord.occurence,
                            "size" : 5000
                        }
                    }
                }
            },
            size: 5000,
            "settings": getAnalysisByLang( keyWord.lang )
        });

        req.then(function( resp ){

            var hits = resp.hits.hits;
            var aggr = resp.aggregations.keyWords.buckets;

            var keysWords = [];

            for( var i = 0; i < aggr.length; i++ ){

                if( aggr[i].key.length > 4 ){

                    keysWords.push({
                        key : aggr[i].key,
                        occurence: aggr[i].doc_count
                    });

                }
            }

            callback( keysWords );

        }, function( err ){
            console.trace( err.message );
        });
    },
    getKeysWordsReferences: function( keyWord, newKeysWord, regexWordsAlreadyFlag, callback ){
        var req = client.search({
            index: "twitter",
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                match: {
                                    tags: keyWord.name
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
            "settings": getAnalysisByLang( keyWord.lang )
        });

        req.then(function( resp ){

            //var hits = resp.hits.hits;
            var aggr = resp.aggregations.keyWords.buckets;

            var tab = [];

            for( var i = 0; i < aggr.length; i++ ){

                tab.push(aggr[i].key);
            }

            callback( tab );

        }, function( err ){
            console.trace( err.message );
        });
    },
    getTweetByWord: function( keyWord, word, callback ){
        var req = client.search({
            index: "twitter",
            body: {
                "query": {
                    "bool": {
                        "must": [
                            {
                                match: {
                                    tags: keyWord.name
                                }
                            },
                            {
                                match: {
                                    content: word
                                }
                            }
                        ]
                    }
                }
            },
            size: 1000,
            "settings": getAnalysisByLang( keyWord.lang )
        });

        req.then(function ( resp ){

            var hits = resp.hits.hits;
            
            callback( hits );

        }, function( err ){
            console.trace( err.message );
        });
    },
    connect: function(){
        return client.ping({
            requestTimeout: 6000,
            hello: "elasticsearch!"
        });
    }
};

function getAnalysisByLang( lang ){
    if( lang === "en" ){
        return {
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
    } else if( lang === "fr" ){
        return {
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
    return {};
}

