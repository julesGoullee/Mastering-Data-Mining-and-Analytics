"use strict";

var _callbackOnNewConnection = [];
var users = require("../users/users.js");
var _io;

function getOrAddUserSession( socket ){
    var user = users.getBySessionId( socket.request.session.id );
    if( !user ){
        user = users.addUser( socket );
    }
    else {
        user.socket = socket;
        user.profile = socket.request.profile;
    }
    return user;
}

module.exports = {
    listen: function( io ){
        _io = io;
        _io.on( "connection", function( socket ){
            var user = getOrAddUserSession( socket );
            for( var i = 0; i < _callbackOnNewConnection.length; i++ ){
                _callbackOnNewConnection[i]( user );
            }
        });
    },
    notifyAll : function( event, data ){
        _io.server.sockets.emit( event, data );
    },
    notifyOne: function( event, data, socket ){
        socket.emit( event, data );
    },
    onNewConnection: function( callback ){
        _callbackOnNewConnection.push( callback );
    },
    on: function( event, socket, callback ){

        socket.on( event, function( data ){
            callback( data );
        });
    },
    notifyAllWithoutMe: function(event , data, socket ){
        socket.broadcast.emit( event, data );
    },
    subscribeTo: function( room, socket ){
        socket.join( room );
    },
    unSubscribeTo: function( room, socket ){
        socket.leave( room );
    },
    notifyInRoom : function( room, event, data ){

        _io.server.sockets.in( room ).emit( event, data );
    },
    notifyAllInRoomWithoutMe: function( room, event , data, socket ){
        socket.in( room).broadcast.emit( event, data );
    }
};