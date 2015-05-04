/**
 * Created by inattendu on 04/05/15.
 */
"use strict";

angularApp.directive("topBar", function(){

    return {
        restrict: "E",
        scope:{
            words : "="
        },
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope, element ) {
        }
    };
});