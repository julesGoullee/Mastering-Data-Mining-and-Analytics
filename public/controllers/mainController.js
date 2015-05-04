"use strict";

angularApp.controller('AppCtrl', function( $scope,$rootScope,socket ){
    $scope.words = {
        values : {},
        draw : function(){}
    };

    socket.on('newRepresentation', function( representationData ){
        $scope.words.values = representationData.words;
        $scope.words.draw();
    });

    socket.on('newWord', function( wordObject ){

        $scope.words.addWord( wordObject );

    });
});

angularApp.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };
});