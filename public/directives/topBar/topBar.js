"use strict";

angularApp.directive( "topBar", function( $rootScope, $mdToast, graphConfig, representation ){
    return {
        restrict: "E",
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope ){

            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;
            scope.tweetCount = representation.tweetCount;

            scope.toggleRight = function(){
                $rootScope.$broadcast("toggleRight");
            };


            scope.$on("newKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("New Word: " + newKeyWord.value )
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

            scope.$on("pauseKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("Word pause : " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            scope.$on("resumeKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("Word resume: " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });
            scope.changeWord = function(word) {

                socket.emit( "setAlreadyTrackKeyWord", word );
            };

            scope.deleteWord = function(word) {

                socket.emit( "stopKeyWord", word.id );
            };

        }
    };
});
