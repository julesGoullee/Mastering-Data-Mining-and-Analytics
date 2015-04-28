"use strict";
var clientES = require("./elasticSearch/elasticSearch.js").client;
var fs = require("fs");
var Table = require('cli-table');


function insertFiletext(){
    var text = fs.readFileSync("./text").toString();

    var quotes = text.split(". ");

    for ( var i = 0; i < quotes.length; i++ ){

        var insertDataEs = clientES.create({
            index: 'text',
            type: 'test',
            body: {
                title: "md",
                content: quotes[i]
            }
        });

        insertDataEs.then( function ( response ) {

            console.log("record[OK]");
        }, function (err) {

            console.trace(err.message);
        });

    }
}



function search(){

    var req = clientES.search({
        index: "twitter",
        body:{
            query: {
                match: {
                    title: '#SalaireHanouna'
                }
            },
            aggs: {
                test: {
                    terms: {
                        field: "content",
                        min_doc_count: 2,
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
        for( var i = 0; i < aggr.length; i++ ){

            //if( aggr[i].key.length > 4){
                table.push([aggr[i].key,  aggr[i].doc_count]);
            //}
        }
        console.log(table.toString());


    }, function ( err ) {
        console.trace( err.message );
    });
}

function main (){
    search();
}

main();