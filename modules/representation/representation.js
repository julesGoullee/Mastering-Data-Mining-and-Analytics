"use strict";

var jf = require('jsonfile');

var config = require('../../config/config.js');

var representations = {
    tag: config.TwitterKeyWord,
    startDate: new Date().toDateString(),
    words : jf.readFileSync("./data.json")
};

function getLevelsByKeyWord( keyWord ){
    for( var i = 0; i < representations.words.length; i ++ ){
        for ( var j = 0 ; j < representations.words[i].content.length; j++){
            if( representations.words[i].content[j].word === keyWord ){
                return i;
            }
        }
    }
    return false;
}

function pushOnLevel( level, word, occurence, references ){
    if( !representations.words[ level ] ){
        representations.words[level] = {
            level: level,
            date: new Date().toDateString(),
            content: []
        }
    }
    representations.words[level].content.push({
        word: word,
        occurence: occurence,
        date: new Date().toDateString(),
        references: references
    });
}

function wordIsinLevel( level, word ){

    if( representations.words[ level ]){
        for ( var i = 0 ; i < representations.words[level].content.length; i++){
            if( representations.words[level].content[i].word === word ){
                return true;
            }
        }
    }
    return false;
}

function getFirstLevelReferences( references ){

    var tabReferences = {};
    var minLevel;

    for( var i = 0 ; i < references.length; i++){
        var levelCurrentReference = getLevelsByKeyWord( references[i] );
        if ( !tabReferences[levelCurrentReference] ){
            tabReferences[levelCurrentReference] = [];
        }
        tabReferences[levelCurrentReference].push(references[i]);
    }

    for( var levelReference in tabReferences){

        if( !minLevel  || minLevel < levelReference){
            minLevel = levelReference;
        }
    }

    var tabReferencesWithoutSameLevelReferences = [];
    var level = parseInt( minLevel, 10 ) || 0 ;

    for( var j = 0 ; j < tabReferences[ level].length ; j ++ ){

        if( !wordIsinLevel( level + 1, tabReferences[ level ][j]) ){

            tabReferencesWithoutSameLevelReferences.push( tabReferences[ level ][j] );
        }
    }

    return {
        level :  level,
        references : tabReferencesWithoutSameLevelReferences
    };
}

module.exports = {
    addKeysWords : function( keysWords, callback ){
        var tabKeyWordObject = [];

        for ( var i = 0; i < keysWords.length ; i++ ){

            if( keysWords[i].references.length === 0 ){

                tabKeyWordObject.push({
                    level: 0,
                    word: keysWords[i].keyWord,
                    references: []
                });

                pushOnLevel(0, keysWords[i].keyWord, keysWords[i].occurence,[]);
            }
            else if( keysWords[i].references.length === 1){

                var level = getLevelsByKeyWord( keysWords[i].references[0] ) + 1;

                tabKeyWordObject.push({
                    level: level,
                    word: keysWords[i].keyWord,
                    references: keysWords[i].references
                });

                pushOnLevel( level , keysWords[i].keyWord, keysWords[i].occurence, keysWords[i].references);
            }
            else{
                var levelsAndReferences = getFirstLevelReferences( keysWords[i].references );
                if( levelsAndReferences.references.length > 0 ) {

                    tabKeyWordObject.push({
                        level: levelsAndReferences.level + 1,
                        word: keysWords[i].keyWord,
                        references: levelsAndReferences.references
                    });

                    pushOnLevel(levelsAndReferences.level + 1, keysWords[i].keyWord, keysWords[i].occurence, levelsAndReferences.references);
                }
            }
        }

        callback( tabKeyWordObject );

        //jf.writeFile("./data.json", representations.words);
    },
    getWordsAlreadyFlag : function(){
        var words = [];

        for( var i = 0; i < representations.words.length; i ++ ){
            for ( var j = 0 ; j < representations.words[i].content.length; j++){
                words.push(representations.words[i].content[j].word);
            }
        }

        return words;
    },
    getJson : function(){
        return representations;
    }
};