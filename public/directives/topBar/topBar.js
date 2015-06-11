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
            console.log(scope.words);
            scope.gravity = graphConfig.gravity;
            scope.toggleRight = buildToggler('right');
            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;

            scope.runningWord = representationService.getCurrentWord;

            scope.$on("newKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("New Word: " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });
            scope.$on("stopKeyword", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("Word deleted: " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            function buildToggler(navID) {
                var debounceFn =  $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                        });
                },300);
                return debounceFn;
            }

            scope.toggleRight();

            scope.changeWord = function(word) {

                socket.emit( "setAlreadyTrackKeyWord", word );
            };

            scope.deleteWord = function(word) {

                socket.emit( "stopKeyWord", word.id );
            };

        }
    };
});
