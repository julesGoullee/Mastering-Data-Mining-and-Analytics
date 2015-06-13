"use strict";

angularApp.service("keysWord", function( $rootScope, socket ){
    var _keysWord = [];

    socket.on( "keysWord", function( keysWord ){

        _keysWord = keysWord;

        if( _keysWord.length ){
            socket.emit( "setAlreadyTrackKeyWord", _keysWord[0].id );

        }
        else {
            $rootScope.showPopup( );
        }
    });

    return {
        values: {},
        getById : function( id ){

            for( var i = 0; i < _keysWord.length; i++ ){
                if( _keysWord[i].id === id ){
                    return _keysWord[i];
                }
            }
            return false;
        },
        add: function( newKeyWord ){
            _keysWord.push( newKeyWord );
        },
        delById : function( id ){

            for( var i = 0; i < _keysWord.length; i++ ){

                if( _keysWord[i].id === id ){

                    _keysWord.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    };
});