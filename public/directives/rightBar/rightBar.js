"use strict";

angularApp.directive( "rightBar",
    function( $mdUtil, $mdSidenav, $rootScope, graphConfig, socket, representationService ){
    return {
        restrict: "E",
        scope:{
            words : "="
        },
        templateUrl:"directives/rightBar/rightBar.html",
        link: function( scope, element ) {

            scope.gravity = graphConfig.gravity;
            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;
            scope.runningWord = representationService.getCurrentWord;
            scope.toggleRight = buildToggler("right");

            scope.changeWord = function( word ){

                if( scope.runningWord() !== word ){
                    socket.emit( "setAlreadyTrackKeyWord", word.id );

                }
            };

            scope.deleteWord = function( word ){

                socket.emit( "stopKeyWord", word.id );
            };

            scope.$on("toggleRight", function(){
                scope.toggleRight();
            });


            function buildToggler( navID ){

                return $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                        });
                },300);
            }
        }
    };
});
