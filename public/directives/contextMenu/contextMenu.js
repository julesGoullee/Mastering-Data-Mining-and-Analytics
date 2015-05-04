/**
 * Created by inattendu on 04/05/15.
 */
"use strict";

angularApp.directive("contextMenu", function(){

    return {
        restrict: "E",
        scope:{
            words : "="
        },
        templateUrl:"directives/contextMenu/contextMenu.html",
        link: function( scope, element ) {
        }
    };
});