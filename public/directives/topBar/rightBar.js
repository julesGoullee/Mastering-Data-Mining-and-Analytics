"use strict";

angularApp.directive( "topBar", function( $mdUtil, $mdSidenav,$rootScope, graphConfig, $mdToast, socket, representationService ){
    return {
        restrict: "E",
        scope:{
            words : "=",
            tweetCount: "="
        },
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope, element ) {
            scope.gravity = graphConfig.gravity;
            scope.toggleRight = buildToggler('right');
            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;

            scope.runningWord = representationService.getCurrentWord;

            scope.changeWord = function(word) {

                socket.emit( "setAlreadyTrackKeyWord", word.id );
            };

            scope.deleteWord = function(word) {

                socket.emit( "stopKeyWord", word.id );
            };
        }
    };
});
