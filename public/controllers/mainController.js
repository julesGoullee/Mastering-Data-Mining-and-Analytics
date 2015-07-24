"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog, representation, keysWord, ga ){

    ga('send', 'pageview', '/home');

    $rootScope.showPopup = function(){

        ga('send', 'event', 'rightBar', 'showPopup');

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

        ga('send', 'event', 'limitExceeded', keyWordExceeded.value );
        ga('send', 'event', 'keyWord', 'limitExceeded');

        $rootScope.$broadcast("limitExceeded", {
            keyWord: keyWordExceeded,
            timeRemaining: keyWordLimit.timeRemaining
        });
    });


});
