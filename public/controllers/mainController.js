"use strict";

angularApp.controller("AppCtrl", function( $scope,$rootScope,socket ){
    $scope.words = {
        values : {},
        draw : function(){}
    };

    $scope.tweetCount = {
        value: 0
    };

    socket.on( "keysWord", function( keysWord ){
        socket.emit( "setNewKeyWord", "paris" );
    });

    socket.on("representation", function( representationData ){
        $scope.words.values = representationData.words;
        $scope.words.draw();
    });

    socket.on("newWord", function( wordObject ){

        $scope.words.addWord( wordObject );

    });

    socket.on("tweetCount", function(tweetCount){
        $scope.tweetCount.value = tweetCount;
    });
});

angularApp.controller("RightCtrl", function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav("right").close()
            .then(function () {
                $log.debug("close RIGHT is done");

            });
    };
});