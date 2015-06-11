"use strict";

var socketHandler = require('../socketHandler/socketHandler.js');
var twitterCatcher = require('../twitter/twitterCatcher.js');
var KeyWord = require("./keyWord.js");
var _keysWord = [];

var keyWordContraint = {
    minLength: 4,
    maxLength: 15,
    lang: ["en", "fr"],
    minOccurence: 5,
    maxOccurence: 100
};

module.exports = {
    addKeyWord: function( name, lang, occurence, userOwner ){
        var keyWord = KeyWord( name, lang, occurence );
        _keysWord.push( keyWord );
        twitterCatcher.trackKeyWord( keyWord, userOwner );
        return keyWord;
    },
    getAll: function(){
        return _keysWord;
    },
    delById: function( id ){
        for( var i = 0; i < _keysWord.length; i++ ){
            if( _keysWord[i].id === id ){
                _keysWord.splice(i, 1);
            }
        }
    },
    getJson: function(){
        var jsonKeysWord = [];

        for( var i = 0; i < _keysWord.length; i++ ){
            jsonKeysWord.push({
                id: _keysWord[i].id,
                value: _keysWord[i].name
            });
        }

        return jsonKeysWord;
    },
    isNewKeyWord: function( name ){
        for( var i = 0; i < _keysWord.length; i++ ){
            if( _keysWord[i].name === name ){
                return false;
            }
        }
        return true;
    },
    isValidKeyWord : function( name, options ){

        if( name && options && options.lang && options.occurence ){

            if( name.length >= keyWordContraint.minLength && name.length <= keyWordContraint.maxLength ){

                if( keyWordContraint.lang.indexOf( options.lang ) != -1 ) {
                    options.occurence = parseInt( options.occurence, 10 );

                    if( options.occurence >= keyWordContraint.minOccurence && options.occurence <= keyWordContraint.maxOccurence){
                        return true;
                    }
                }
            }
        }

        return false;
    },
    getByName: function( name ){
        for( var i = 0; i < _keysWord.length; i++ ){
            if( _keysWord[i].name === name ){
                return _keysWord[i];
            }
        }
        return false;
    },
    getById: function( id ){
        for( var i = 0; i < _keysWord.length; i++ ){
            if( _keysWord[i].id === id ){
                return _keysWord[i];
            }
        }
        return false;
    },
    mock: function( mockSocketHandler, mockTwitterCatcher ){
        socketHandler = mockSocketHandler;
        twitterCatcher = mockTwitterCatcher;
    }
};
