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

            var fillBoxWithTweets = function(wordId) {
                var word = representation.findById(wordId);

                socket.on("getTweetByWord",function( tweets ){
                    for (var i = 0; i < tweets.length; i++) {
                        var tweet = tweets[i];
                        //console.log( tweet._source.content + "  date: " + tweet._source.date);
                    }
                });

                var message = {nameKeyWordTracked: representation.getCurrentTag(), word: wordId};

                socket.emit("getTweetByWord", message);
            }

            scope.$on('openTweetBox', function(event, word) {

                fillBoxWithTweets(word.id);
                scope.show();
            })
        }
    };
});
