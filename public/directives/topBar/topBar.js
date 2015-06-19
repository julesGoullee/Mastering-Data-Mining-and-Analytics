"use strict";

angularApp.directive( "topBar", function( $rootScope, $mdToast, graphConfig, keysWord, representation ){
    return {
        restrict: "E",
        scope:{

        },
        templateUrl:"directives/topBar/topBar.html",
        link: function( scope ){

            scope.restoreHiddenNodes = graphConfig.restoreHiddenNodes;
            scope.showPopup = $rootScope.showPopup;
            scope.tweetCount = representation.tweetCount;
            scope.runningWord = keysWord.currentKeyWord;

            scope.toggleRight = function(){
                $rootScope.$broadcast("toggleRight");
            };

            // Toasts
            scope.$on("newKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content( "New Word: " + newKeyWord.value )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            scope.$on("stopKeyword", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content( "Word deleted: " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            scope.$on("pauseKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content( "Word pause : " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            scope.$on("resumeKeyWord", function( event, newKeyWord ){
                $mdToast.show(
                    $mdToast.simple()
                        .content( "Word resume: " + newKeyWord )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

            scope.$on( "limitExceeded", function( event, data ){
                var dateLimit = new Date( data.timeRemaining );

                var curMinute = dateLimit.getMinutes() < 10 ? "0" + dateLimit.getMinutes() : dateLimit.getMinutes();
                var curSeconds = dateLimit.getSeconds() < 10 ? "0" + dateLimit.getSeconds() : dateLimit.getSeconds();
                console.log("show");
                $mdToast.show(
                    $mdToast.simple()
                        .content( "Word limit exceeded: " + data.keyWord.name + " time remaining " + curMinute + "m:" + curSeconds + "s" )
                        .position("top left")
                        .hideDelay(3000)
                );
            });

        }
    };
});
