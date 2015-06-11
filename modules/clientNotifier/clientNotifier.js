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

function getKeysWordsByUser( user ){
    var keysWords = keysWord.getJson();
    var userKeysWord = user.getKeysWord();

    for( var i = 0; i < userKeysWord.length; i++ ){

        var userKeyWord = userKeysWord[i];

        for( var j = 0; j < keysWords.length; j++){

            var keyWord = keysWords[j];

            if( keyWord.id === userKeyWord.id ){
                keysWords[j].isMine = true;
                break;
            }

        }

    }

    return keysWords;
}

module.exports = {
    connect : function(){

        socketHandler.onNewConnection(function( user ){

            socketHandler.notifyOne("keysWord", getKeysWordsByUser( user ), user.socket );

            socketHandler.on("setAlreadyTrackKeyWord", user.socket, function( idKeyWord ){
                var keyWord = keysWord.getById( idKeyWord );
                initUser( user, keyWord );
            });

            socketHandler.on("setNewKeyWord", user.socket, function( data ){

                if( keysWord.isValidKeyWord( data.newKeyWord, data.options ) ){

                    if( keysWord.isNewKeyWord( data.newKeyWord ) ){

                        var newKeyWord = keysWord.addKeyWord( data.newKeyWord, data.options.lang, data.options.occurence, user);
                        user.addKeyWord( newKeyWord );

                        socketHandler.notifyAll("newKeyWord", { id: newKeyWord.id , value: newKeyWord.name } );
                    }

                    var keyWord = keysWord.getByName( data.newKeyWord );
                    initUser( user, keyWord );
                }
            });

            socketHandler.on("stopKeyWord", user.socket, function( idKeyWord ){
                if( user.delKeyWord( idKeyWord ) ){

                }
            });
        });
    }
};