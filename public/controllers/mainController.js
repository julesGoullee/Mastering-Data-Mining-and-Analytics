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
        var keyWordExceeded = keysWord.getById( keyWordLimit.id );
        $rootScope.$broadcast("limitExceeded", {
            keyWord: keyWordExceeded,
            timeRemaining: keyWordLimit.timeRemaining
        });
    });


});
