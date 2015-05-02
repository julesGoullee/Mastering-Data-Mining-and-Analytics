"use strict";

angularApp.controller('AppCtrl', function( $scope,$rootScope,socket ){
    $scope.words = {
        values : {},
        draw : function(){}
    };

    socket.on('newRepresentation', function( representationData ){
        var representation = angular.fromJson(representationData);
        $scope.words.values = representation.words;
        $scope.words.draw();
    });
});