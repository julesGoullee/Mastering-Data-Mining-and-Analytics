"use strict";

var socketHandler = require('../socketHandler/socketHandler.js');
var twitterCatcher = require('../twitter/twitterCatcher.js');
var KeyWord = require("./keyWord.js");
var _keysWord = [];

module.exports = {
    addKeyWord: function( name ){
        var keyWord = KeyWord( name );
        _keysWord.push( keyWord );
        twitterCatcher.trackKeyWord( keyWord );
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
            jsonKeysWord.push(_keysWord[i].name);
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
