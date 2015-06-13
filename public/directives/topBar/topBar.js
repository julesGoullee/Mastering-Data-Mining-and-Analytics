"use strict";

angularApp.directive( "topBar", function( $mdUtil, $mdSidenav,$rootScope, graphConfig, $mdToast, socket, representationService ){
    return {
        restrict: "E",
        scope:{
            words : "=",
            tweetCount: "="
        },
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope ){

            console.log(scope.words);
            scope.gravity = graphConfig.gravity;
            scope.toggleRight = buildToggler("right");
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

            function buildToggler( navID ){

                return $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                        });
                },300);
            }

            scope.toggleRight();

            scope.changeWord = function( word ){
                if( scope.runningWord() !== word ){
                    socket.emit( "setAlreadyTrackKeyWord", word.id );

                }
            };

            scope.deleteWord = function( word ){

                socket.emit( "stopKeyWord", word.id );
            };

        }
    };
});
