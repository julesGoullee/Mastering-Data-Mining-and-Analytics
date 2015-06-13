"use strict";

angularApp.directive( "topBar", function( $rootScope, $mdToast, graphConfig ){
    return {
        restrict: "E",
        scope:{
            tweetCount: "="
        },
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope ){

            scope.toggleRight = function(){
                $rootScope.$broadcast("toggleRight");
            };

            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;

            scope.showPopup = $rootScope.showPopup;

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
        }
    };
});
