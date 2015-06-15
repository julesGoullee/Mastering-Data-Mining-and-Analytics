"use strict";

var utils = require("../utils/utils.js");
var representation = require('../representation/representation.js')();
var _limitUserMaxKeyWords = 2;
var _users = [];

function User( socket ) {
    var self = this;
    var _keysWord = [];

    self.socket = socket;
    self.session = socket.request.session.passport.user;
    self.tweetCount = 0;
    self.client = false;
    self.id = utils.guid();

    self.addKeyWord = function( keyWord ){
        _keysWord.push( keyWord );
    };

    self.getKeysWord = function(){
        return _keysWord;
    };

    self.isMyKeyWord = function( keyWordId ){
        for( var i = 0; i < _keysWord.length; i++ ){

            var word = _keysWord[i];

            if( word.id === keyWordId ){

                return true;
            }
        }
        return false;
    };

    self.delKeyWord = function( keyWordId ){

        for( var i = 0; i < _keysWord.length; i++ ){

            var word = _keysWord[i];

            if( word.id === keyWordId ){

                _keysWord.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    self.isReadyForStream = function(){
        var nbKeyWordsStreaming = 0;
        for (var i = 0; i < _keysWord.length; i++) {
            var keyWord = _keysWord[i];
            if( keyWord.stream && !keyWord.isWait ){
                nbKeyWordsStreaming ++;
            }
        }
        return nbKeyWordsStreaming < _limitUserMaxKeyWords;
    };

    _users.push( self );
}

module.exports = {
    addUser: function( socket ){
       return new User( socket );
    },
    delUserById: function( id ){
        for( var i = 0; i < _users.length; i++ ){
            if( _users[i].id === id ){
                _users.splice(i, 1);
            }
        }
    },
    getById: function( id ){
        for( var i = 0; i < _users.length; i++ ){
            if( _users[i].id === id ){
                return _users[i];
            }
        }
        return false;
    },
    getBySessionId: function( sessionId ){
        for( var i = 0; i < _users.length; i++ ){
            if( _users[i].session.id === sessionId ){
                return _users[i];
            }
        }
        return false;
    },
    getUsers: function(){
        return _users;
    }
};