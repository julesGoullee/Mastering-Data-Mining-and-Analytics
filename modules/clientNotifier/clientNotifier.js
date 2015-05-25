"use strict";

var config = require("../../config/config.js");
var socketHandler = require("../socketHandler/socketHandler.js");
var keysWord = require("../keysWord/keysWord.js");

function initUser( user , keyWord ){

    if( user.idKeyWord ){
        socketHandler.unSubscribeTo( user.idKeyWord, user.socket );
    }

    user.idKeyWord = keyWord.id;
    socketHandler.subscribeTo( keyWord.id, user.socket );
    socketHandler.notifyOne( "tweetCount", keyWord.tweetCount, user.socket );
    socketHandler.notifyOne( "representation", keyWord.representation.getJson(), user.socket );
}

module.exports = {
    connect : function(){

        socketHandler.onNewConnection(function( user ){

            socketHandler.notifyOne("keysWord", keysWord.getJson(), user.socket );

            socketHandler.on("setAlreadyTrackKeyWord", user.socket, function( idKeyWord ){
                var keyWord = keysWord.getById( idKeyWord );
                initUser( user, keyWord );
            });

            socketHandler.on("setNewKeyWord", user.socket, function( data ){

                if( keysWord.isValidKeyWord( data.newKeyWord, data.options ) ){

                    if( keysWord.isNewKeyWord( data.newKeyWord ) ){

                        var newKeyWord = keysWord.addKeyWord( data.newKeyWord, data.options.lang, data.options.occurence, { token: user.session.token , tokenSecret: user.session.tokenSecret });
                        socketHandler.notifyAllWithoutMe("newKeyWord", { id: newKeyWord.id , value: newKeyWord.name }, user.socket );
                    }

                    var keyWord = keysWord.getByName( data.newKeyWord );
                    initUser( user, keyWord );
                }
            });
        });
    }
};