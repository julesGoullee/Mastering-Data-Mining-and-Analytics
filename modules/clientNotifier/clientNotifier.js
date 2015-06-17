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
                            var newKeyWord = keysWord.addKeyWord( data.newKeyWord, data.options.lang, data.options.occurence, user );
                            newKeyWord.isMine = true;
                            socketHandler.notifyOne( "newKeyWord", keysWord.getOneJson(newKeyWord) , user.socket );
                            newKeyWord.isMine = false;
                            socketHandler.notifyAllWithoutMe( "newKeyWord", keysWord.getOneJson(newKeyWord) , user.socket );

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
                    socketHandler.notifyAll( "stopKeyWord", idKeyWord );
                }
            });

            socketHandler.on("pauseKeyWord", user.socket, function( idKeyWord ){

                var keyWord = keysWord.getById( idKeyWord );

                if( user.isMyKeyWord( keyWord.id ) && keysWord.waitKeyWord( keyWord.id ) ){
                    socketHandler.notifyAll( "pauseKeyWord", keyWord.id );
                }
            });

            socketHandler.on("resumeKeyWord", user.socket, function( idKeyWord ){
                var keyWord = keysWord.getById( idKeyWord );

                if( user.isMyKeyWord( keyWord.id ) && keysWord.resumeKeyWord( keyWord.id ) ){

                    setTimeout(function () {
                        if( keyWord.stream && !keyWord.isWait ){
                            socketHandler.notifyAll("resumeKeyWord", keyWord.id);
                        }
                    }, 3000);
                }
            });

            socketHandler.on("getTweetByWord", user.socket, function( data ){

                var keyWord = keysWord.getByName( data.nameKeyWordTracked );
                if( keyWord ){
                    keyWord.getTweetByWord( keyWord, data.word, function( tweets ){

                        if( tweets ){
                            socketHandler.notifyOne( "getTweetByWord", tweets, user.socket );
                        }
                    });

                }
            });
        });
    }
};