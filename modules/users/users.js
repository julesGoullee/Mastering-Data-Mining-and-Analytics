"use strict";

var utils = require("../utils/utils.js");
var representation = require('../representation/representation.js')();

var _users = [];

function User( socket ) {
    var self = this;
    var _keysWord = [];

    self.socket = socket;
    self.session = socket.request.session.passport.user;
    self.tweetCount = 0;
    self.id = utils.guid();

    self.addKeyWord = function( keyWord ){
        _keysWord.push( keyWord );
    };

    self.getKeysWord = function(){
        return _keysWord;
    };

    self.delKeyWord = function( keyWordId ){

        for( var i = 0; i < _keysWord.length; i++ ){

            var word = _keysWord[i];

            if( word.id === keyWordId ){

                word.stream = false;

                _keysWord.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    self.waitKeyWord = function( keyWordId ){

        for( var i = 0; i < _keysWord.length; i++ ){

            var word = _keysWord[i];

            if( word.id === keyWordId ){

                word.stream = false;
                word.isWait = true;

                return word;
            }
        }
        return false;
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