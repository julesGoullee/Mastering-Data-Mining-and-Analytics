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

    socket.on("representation", function( representationData ){

        representation.setRepresentation( representationData );
        $rootScope.$broadcast("draw");

        //var word = representationData.words[1].content[3].word;
        //
        //socket.on("getTweetByWord",function( tweets ){
        //    for (var i = 0; i < tweets.length; i++) {
        //        var tweet = tweets[i];
        //        console.log( tweet._source.content + "  date: " + tweet._source.date);
        //    }
        //});
        //
        //socket.emit("getTweetByWord", {nameKeyWordTracked: representationData.tag, word: "paris"});
    });

    socket.on("newWord", function( wordObject ){

        $rootScope.$broadcast("addWord", wordObject );
    });

    socket.on("limitExceeded", function( keyWordLimit ){

        $rootScope.$broadcast("limitExceeded", {
            keyWord: keysWord.getById( keyWordLimit.id ),
            timeRemaining: keyWordLimit.timeRemaining
        });
    });


    socket.on("tweetCount", function( tweetCount ){

        representation.tweetCount.value = tweetCount;
    });
});
