"use strict";

angularApp.directive( "tweetBox",
    function( socket, representation ){
    return {
        restrict: "E",
        scope: {},
        templateUrl:"directives/tweetBox/tweetBox.html",
        link: function( scope, element ) {
            scope.visible = false;


            scope.show = function() {
                scope.visible = true;
            };

            scope.hide = function() {
                scope.visible = false;
            };

            scope.tweets = [];

            var fillBoxWithTweets = function( wordId ){
                var word = representation.findById(wordId);

                socket.on("getTweetByWord",function( tweets ){
                    scope.tweets = tweets;
                });

                var message = { nameKeyWordTracked: representation.getCurrentTag(), word: wordId };

                socket.emit("getTweetByWord", message);
            };

            scope.$on('openTweetBox', function(event, word) {

                fillBoxWithTweets(word.id);
                scope.show();
            })
        }
    };
});
