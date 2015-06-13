"use strict";

angularApp.service("keysWord", function( $rootScope, socket ){
    var _keysWord = [];
    var _currentKeyWord;

    function get(){
        return _keysWord;
    }

    function currentKeyWord( idKeyWord ){

        var keyWord = getById( idKeyWord );

        if( keyWord ){
            _currentKeyWord = keyWord;
        }
        return _currentKeyWord;
    }

    function getById( id ) {

        for( var i = 0; i < _keysWord.length; i++ ){
            if( _keysWord[i].id === id ){
                return _keysWord[i];
            }
        }
        return false;
    }

    function add( newKeyWord ){
        _keysWord.push( newKeyWord );
    }

    function delById( id ){

        for( var i = 0; i < _keysWord.length; i++ ){

            if( _keysWord[i].id === id ){

                _keysWord.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    socket.on("keysWord", function( keysWord ){

        _keysWord = keysWord;

        if( _keysWord.length ){

            currentKeyWord( _keysWord[0].id );

            socket.emit( "setAlreadyTrackKeyWord", _currentKeyWord.id );

        }
        else {
            $rootScope.showPopup();
        }
    });

    socket.on("newKeyWord", function( newKeyWord ){
        add( newKeyWord );
        $rootScope.$broadcast( "newKeyWord", newKeyWord );
    });

    socket.on("stopKeyWord", function( wordId ){
        console.log("stop kw: " + wordId, getById( wordId ) );
        $rootScope.$broadcast( "stopKeyWord", getById( wordId ) );
        delById( wordId );
    });

    return {
        get: get,
        currentKeyWord: currentKeyWord,
        getById : getById,
        add: add,
        delById : delById
    };
});