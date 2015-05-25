"use strict";

var utils = require("../utils/utils.js");
var representation = require('../representation/representation.js')();

var _users = [];

function User( socket ) {
    var self = this;
    self.socket = socket;
    self.session = socket.request.session.passport.user;
    self.tweetCount = 0;
    self.id = utils.guid();

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
    getUsers: function(){
        return _users;
    }
};