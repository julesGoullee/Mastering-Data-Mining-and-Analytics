"use strict";

var _io;
var sockets = [];

module.exports = {
    listen: function( io ){
        _io = io;
        _io.on( "connection", function( socket ) {
            sockets.push( socket );
        });
    },
    notifyAll : function( event, data ){
        for( var i = 0; i < sockets.length; i++){
            sockets[i].emit( event, data);
        }
    }
};