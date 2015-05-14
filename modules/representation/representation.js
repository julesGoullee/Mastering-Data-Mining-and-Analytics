"use strict";


var config = require('../../config/config.js');

function Representation(){
    var self = this;

    var _representationsData = {
        tag: config.TwitterKeyWord,
        startDate: Math.floor(new Date() / 1000),
        words : []
    };

    if( config.useMockData ){
        var jf = require('jsonfile');
        _representationsData.words = jf.readFileSync(__dirname  + "/data.json");
    }

    self.addKeysWords = function( keysWords, callback ){
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
    };

    self.getWordsAlreadyFlag = function(){
        var words = [];

        for( var i = 0; i < _representationsData.words.length; i ++ ){
            for ( var j = 0 ; j < _representationsData.words[i].content.length; j++){
                words.push(_representationsData.words[i].content[j].word);
            }
        }

        return words;
    };

    self.getJson = function(){
        return _representationsData;
    };

    function getLevelsByKeyWord( keyWord ){

        for( var i = 0; i < _representationsData.words.length; i ++ ){
            for ( var j = 0 ; j < _representationsData.words[i].content.length; j++ ){
                if( _representationsData.words[i].content[j].word === keyWord ){
                    return i;
                }
            }
        }
        return false;
    }

    function pushOnLevel( level, word, occurence, references ){

        if( !_representationsData.words[ level ] ){
            _representationsData.words[level] = {
                level: level,
                date: Math.floor(new Date() / 1000),
                content: []
            }
        }
        _representationsData.words[level].content.push({
            word: word,
            occurence: occurence,
            date: Math.floor(new Date() / 1000),
            references: references
        });
    }

    function wordIsInLevel( level, word ){

        if( _representationsData.words[ level ] ){
            for ( var i = 0 ; i < _representationsData.words[level].content.length; i++ ){
                if( _representationsData.words[level].content[i].word === word ){
                    return true;
                }
            }
        }
        return false;
    }

    function getFirstLevelReferences( references ){

        var tabReferences = {};
        var minLevel;

        for( var i = 0 ; i < references.length; i++ ){
            var levelCurrentReference = getLevelsByKeyWord( references[i] );
            if ( !tabReferences[levelCurrentReference] ){
                tabReferences[levelCurrentReference] = [];
            }
            tabReferences[levelCurrentReference].push(references[i]);
        }

        for( var levelReference in tabReferences ){

            if( !minLevel  || minLevel < levelReference ){
                minLevel = levelReference;
            }
        }

        var tabReferencesWithoutSameLevelReferences = [];
        var level = parseInt( minLevel, 10 ) || 0 ;

        for( var j = 0 ; j < tabReferences[ level].length ; j ++ ){

            if( !wordIsInLevel( level + 1, tabReferences[ level ][j]) ){

                tabReferencesWithoutSameLevelReferences.push( tabReferences[ level ][j] );
            }
        }

        return {
            level :  level,
            references : tabReferencesWithoutSameLevelReferences
        };
    }
}

module.exports = function(){
    return new Representation();
};