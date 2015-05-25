"use strict";

angularApp.directive( "topBar", function( $mdUtil, $mdSidenav,$rootScope, graphConfig, $mdToast ){
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

            scope.$on("newKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content("New Word: " + newKeyWord )
                        .position("top right")
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
        }
    };
});
