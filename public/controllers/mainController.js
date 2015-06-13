"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog, representation, keysWord ){

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


    socket.on( "newKeyWord", function( newKeyWord ){
        keysWord.add( newKeyWord );
        $scope.$broadcast( "newKeyWord", newKeyWord.value );
    });

    socket.on("representation", function( representationData ){
        representation.setRepresentation( representationData );
        $rootScope.$broadcast("draw");
    });

    socket.on("newWord", function( wordObject ){
        $rootScope.$broadcast("addWord", wordObject );
    });

    socket.on("stopKeyWord", function( wordId ){
        console.log("stop kw: " + wordId, keysWord.getById( wordId ) );
        $scope.$broadcast( "stopKeyWord", keysWord.getById( wordId ) );
        keysWord.delById( wordId );
    });

    socket.on("tweetCount", function( tweetCount ){
        representation.tweetCount.value = tweetCount;
    });
});
