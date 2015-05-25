"use strict";

var _callbackOnNewConnection = [];
var users = require("../users/users.js");
var _io;

module.exports = {
    listen: function( io ){
        _io = io;
        _io.on( "connection", function( socket ) {

            for( var i = 0; i < _callbackOnNewConnection.length; i++){
                _callbackOnNewConnection[i]( users.addUser( socket ) );
            }
        });
    },
    notifyAll : function( event, data ){
        _io.sockets.emit( event, data );
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
    notifyInRoom : function( room, event, data ){

        _io.server.sockets.in( room ).emit( event, data );
    }
};