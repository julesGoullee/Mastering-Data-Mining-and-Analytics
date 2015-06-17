"use strict";

angularApp.directive( "login", function(){
    return {
        restrict: "E",
        scope:{
        },
        templateUrl: "/directives/login/login.html",
        link: function( scope, element ) {
        }
    };
});
