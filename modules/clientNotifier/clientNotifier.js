"use strict";

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

            socketHandler.notifyOne("keysWord", keysWord.getJsonByUser( user ), user.socket );

            socketHandler.on("setAlreadyTrackKeyWord", user.socket, function( idKeyWord ){

                var keyWord = keysWord.getById( idKeyWord );

                if( keyWord ){
                    initUser( user, keyWord );
                }
            });

            socketHandler.on("setNewKeyWord", user.socket, function( data ){

                if( keysWord.isValidKeyWord( data.newKeyWord, data.options ) ){

                    if( keysWord.isNewKeyWord( data.newKeyWord ) ){

                        if( user.isReadyForStream() ){
                            var newKeyWord = keysWord.addKeyWord( data.newKeyWord, data.options.lang, data.options.occurence, user);
                            socketHandler.notifyAll("newKeyWord", { id: newKeyWord.id , value: newKeyWord.name } );

                        }
                        else{
                            return;
                        }

                    }

                    var keyWord = keysWord.getByName( data.newKeyWord );

                    if( keyWord ){
                        initUser( user, keyWord );

                    }
                }
            });

            socketHandler.on("stopKeyWord", user.socket, function( idKeyWord ){

                if( user.isMyKeyWord( idKeyWord ) && keysWord.delById( idKeyWord ) ){
                    socketHandler.notifyAll("stopKeyWord", idKeyWord);
                }
            });

            socketHandler.on("pauseKeyWord", user.socket, function( idKeyWord ){

                if( user.isMyKeyWord( idKeyWord ) && keysWord.waitKeyWord( idKeyWord ) ){
                    socketHandler.notifyAll("pauseKeyWord", idKeyWord);
                }
            });

            socketHandler.on("resumeKeyWord", user.socket, function( idKeyWord ){

                if( user.isMyKeyWord( idKeyWord ) && keysWord.resumeKeyWord( idKeyWord ) ){
                    socketHandler.notifyAll("pauseKeyWord", idKeyWord);
                }
            });
        });
    }
};