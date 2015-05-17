"use strict";

var config = require('../../config/config.js');
var socketHandler = require('../socketHandler/socketHandler.js');
var keysWord = require("../keysWord/keysWord.js");

function initUser( user , keyWord ){

    user.idKeyWord = keyWord.id;
    socketHandler.subscribeTo( keyWord.id, user.socket );
    socketHandler.notifyOne( "tweetCount", keyWord.tweetCount, user.socket );
    socketHandler.notifyOne( "representation", keyWord.representation.getJson(), user.socket );
}

module.exports = {
    connect : function(){
        //keysWord.addKeyWord( "new york" );
        //keysWord.addKeyWord( "paris" );

        socketHandler.onNewConnection(function( user ){

            socketHandler.notifyOne( "keysWord", keysWord.getJson(), user.socket );

            socketHandler.on( "setAlreadyTrackKeyWord", user.socket, function( idKeyWord ){
                var keyWord = keysWord.getById( idKeyWord );
                initUser( user, keyWord );
            });

            socketHandler.on( "setNewKeyWord", user.socket, function( newKeyWord ){

                if( keysWord.isNewKeyWord( newKeyWord ) ){

                    keysWord.addKeyWord( newKeyWord );
                    socketHandler.notifyAllWithoutMe("newKeyWord", newKeyWord, user.socket );
                }

                var keyWord = keysWord.getByName( newKeyWord );
                initUser( user, keyWord );

            });
        });
    }
};