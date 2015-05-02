"use strict";

var _io;
var sockets = [];
var _callbackOnNewConnection = [];

module.exports = {
    listen: function( io ){
        _io = io;
        _io.on( "connection", function( socket ) {
            sockets.push( socket );

            for( var i = 0; i < _callbackOnNewConnection.length; i++){
                _callbackOnNewConnection[i]( socket );
            }
        });
    },
    notifyAll : function( event, data ){
        for( var i = 0; i < sockets.length; i++){
            sockets[i].emit( event, data);
        }
    },
    notifyOne: function( event, data, socket ){
        socket.emit(event, data);
    },
    getNbSockets : function(){
        return sockets.length;
    },
    onNewConnection: function( callback ){
        _callbackOnNewConnection.push( callback );
    }
};