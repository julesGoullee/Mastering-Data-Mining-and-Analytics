"use strict";

var angularApp = angular.module('Mastering-Data-Mining-and-Analytics', ['ngMaterial',"btford.socket-io"]);

angularApp.factory('socket', function (socketFactory) {
    return socketFactory();
});