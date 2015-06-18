"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog, representation, keysWord ){

    $rootScope.showPopup = function(){

        $mdDialog.show({
            controller: "ChooseTrackController",
            templateUrl: "../dialogs/chooseTrack.html"
        }).then(function(){
            //fermeture popup
        },function(){
            //error
        });
    };


    socket.on("newWord", function( wordObject ){

        $rootScope.$broadcast("addWord", wordObject );
    });

    socket.on("limitExceeded", function( keyWordLimit ){

        $rootScope.$broadcast("limitExceeded", {
            keyWord: keysWord.getById( keyWordLimit.id ),
            timeRemaining: keyWordLimit.timeRemaining
        });
    });


});
