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
        }
    };
});
