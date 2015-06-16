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

function addKeyWord( name, lang, occurence, userOwner ){


    var keyWord = KeyWord( name, lang, occurence, userOwner );
    _keysWord.push( keyWord );
    twitterCatcher.trackKeyWord( keyWord, userOwner );
    userOwner.addKeyWord( keyWord );

    return keyWord;
}

function resumeKeyWord( keyWordId ){

    var keyWord = getById( keyWordId );

    if( keyWord ) {
        keyWord.resume();
        twitterCatcher.trackKeyWord( keyWord, keyWord.userOwner );
        return keyWord;
    }
    return false;

}

function waitKeyWord ( keyWordId ){

    var keyWord = getById( keyWordId );

    if( keyWord ) {
        keyWord.pause();
        return keyWord;
    }
    return false;
}

function getByName ( name ){
    for( var i = 0; i < _keysWord.length; i++ ){
        if( _keysWord[i].name === name ){
            return _keysWord[i];
        }
    }
    return false;
}

function getById( id ){

    for( var i = 0; i < _keysWord.length; i++ ){
        if( _keysWord[i].id === id ){
            return _keysWord[i];
        }
    }
    return false;
}

function getAll(){
    return _keysWord;
}

function getOneJson(keyword){

    return {
        id: keyword.id,
        value: keyword.name,
        isWait: keyword.isWait
    };
}

function getJson(){

    var jsonKeysWord = [];

    for( var i = 0; i < _keysWord.length; i++ ){
        jsonKeysWord.push(getOneJson(_keysWord[i]));
    }

    return jsonKeysWord;
}

function getJsonByUser( user ){

    var keysWords = getJson();

    for( var i = 0; i < keysWords.length; i++ ){

        var keyWord = keysWords[i];

        if( user.isMyKeyWord( keyWord.id ) ){
            keyWord.isMine = true;
        }
    }

    return keysWords;
}

function delById( id ){

    for( var i = 0; i < _keysWord.length; i++ ){
        var keyWord = _keysWord[i];

        if( keyWord.id === id ){

            keyWord.userOwner && _keysWord[i].userOwner.delKeyWord(keyWord.id);
            keyWord.pause();
            _keysWord.splice(i, 1);
            return true;
        }
    }
    return false;
}

function isNewKeyWord( name ){
    for( var i = 0; i < _keysWord.length; i++ ){
        if( _keysWord[i].name === name ){
            return false;
        }
    }
    return true;
}

function isValidKeyWord( name, options ){

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
}

module.exports = {
    addKeyWord: addKeyWord,
    resumeKeyWord: resumeKeyWord,
    waitKeyWord: waitKeyWord,
    getByName: getByName,
    getById: getById,
    getAll: getAll,
    getJson: getJson,
    getOneJson: getOneJson,
    getJsonByUser: getJsonByUser,
    delById: delById,
    isNewKeyWord: isNewKeyWord,
    isValidKeyWord: isValidKeyWord,
    mock: function( mockSocketHandler, mockTwitterCatcher ){
        socketHandler = mockSocketHandler;
        twitterCatcher = mockTwitterCatcher;
    }
};
