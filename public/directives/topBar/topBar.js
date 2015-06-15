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
