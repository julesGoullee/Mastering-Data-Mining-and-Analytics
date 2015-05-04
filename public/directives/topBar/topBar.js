"use strict";
angularApp.directive( "topBar", function($mdUtil,$mdSidenav,$log,graphConfig){
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
            function buildToggler(navID) {
                var debounceFn =  $mdUtil.debounce(function(){
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            $log.debug("toggle " + navID + " is done");
                        });
                },300);
                return debounceFn;
            }
        }
    };
});
