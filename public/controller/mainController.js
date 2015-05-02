"use strict";

angularApp.controller('AppCtrl', function( $scope,socket ){
    socket.on('newRepresentation', function( representationData ){
        var representation = angular.fromJson(representationData);
    });
});