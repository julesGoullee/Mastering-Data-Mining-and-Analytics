"use strict";

angularApp.directive( "rightBar",
    function( $mdUtil, $mdSidenav, $rootScope, graphConfig, socket, keysWord, ga ){
    return {
        restrict: "E",
        scope: {},
        templateUrl:"directives/rightBar/rightBar.html",
        link: function( scope, element ) {

            scope.gravity = graphConfig.gravity;
            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;
            scope.runningWord = keysWord.currentKeyWord;
            scope.words = keysWord.get;
            scope.isReadyForStream = keysWord.isReadyForStream;

            scope.changeWord = function( word ){

                if( scope.runningWord() !== word ){
                    socket.emit( "setAlreadyTrackKeyWord", word.id );
                    scope.runningWord( word.id );

                    ga('send', 'event', 'keyWord', 'change');
                }
            };

            scope.deleteWord = function( word ){

                socket.emit( "stopKeyWord", word.id );

                ga('send', 'event', 'keyWord', 'stop');

            };

            scope.pauseWord = function( word ){

                socket.emit( "pauseKeyWord", word.id );
                word.loading = true;

                ga('send', 'event', 'keyWord', 'pause');
            };

            scope.resumeWord = function( word ){

                if( keysWord.isReadyForStream() ){

                    socket.emit( "resumeKeyWord", word.id );

                    ga('send', 'event', 'keyWord', 'resume');
                }
            };


            function buildToggler( navID ){

                return $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            ga('send', 'event', 'rightBar', 'open');
                        });
                },300);
            }

            scope.toggleRight = buildToggler("right");

            scope.$on("toggleRight", function(){
                scope.toggleRight();
            });

        }
    };
});
