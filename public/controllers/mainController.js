"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog, representationService ){
    $scope.keysWord = [];
    $scope.words = {
        values : {},
        draw : function(){}
    };

    $scope.tweetCount = {
        value: 0
    };

    $rootScope.showPopup = function(){
        $mdDialog.show({
            controller: "ChooseTrackController",
            templateUrl: '../dialogs/chooseTrack.html',
            locals:
            {
                keywords: $scope.keysWord
            }
        }).then(function() {
            //fermeture popup
        }, function() {
            //error
        });
    };

    var receiveKeywords = function( keysWord ){
        $scope.keysWord = keysWord;

        $scope.keysWord.getById = function( id ){

            for( var i = 0; i < $scope.keysWord.length; i++ ){
                if( $scope.keysWord[i].id === id ){
                    return $scope.keysWord[i];
                }
            }
            return false;
        };

        $scope.keysWord.delById = function( id ){

            for( var i = 0; i < $scope.keysWord.length; i++ ){

                if( $scope.keysWord[i].id === id ){

                    $scope.keysWord.splice(i, 1);
                    return true;
                }
            }
            return false;
        };

        if( keysWord.length ){
            socket.emit( "setAlreadyTrackKeyWord", keysWord[0].id );

        }
        else {
            $rootScope.showPopup( );
        }
    };

    var addKeyword = function( newKeyWord ){
        $scope.keysWord.push( newKeyWord );
        $scope.$broadcast( "newKeyWord", newKeyWord.value );
    };

    var receiveRepresentation = function( representationData ){
        representationService.setRepresentation(representationData);
        $scope.words.values = representationData.words;
        $scope.words.draw();
    };

    socket.on( "keysWord", receiveKeywords );
    socket.on( "newKeyWord", addKeyword );
    socket.on("representation", receiveRepresentation );

    socket.on("newWord", function( wordObject ){
        $scope.words.addWord( wordObject );
    });


    socket.on("stopKeyWord", function( wordId ){
        console.log("stop kw: " + wordId, $scope.keysWord.getById( wordId ) );
        $scope.$broadcast( "stopKeyWord", $scope.keysWord.getById( wordId ) );
        $scope.keysWord.delById( wordId );
    });

    socket.on("tweetCount", function( tweetCount ){
        $scope.tweetCount.value = tweetCount;
    });
});
