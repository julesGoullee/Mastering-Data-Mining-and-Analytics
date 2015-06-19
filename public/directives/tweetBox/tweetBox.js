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
                if( wordId !== representation.getCurrentTag() ){
                    var message = { nameKeyWordTracked: representation.getCurrentTag(), word: wordId };
                    socket.emit("getTweetByWord", message);
                }

            };

            socket.on("getTweetByWord",function( tweets ){
                scope.tweets = tweets;
            });

            scope.$on('openTweetBox', function(event, word) {

                fillBoxWithTweets(word.id);
                scope.show();
            });

            // Drag&Drop
            var divElement = angular.element('.tweet-box');
            var topBarElement = angular.element('#topBar');
            var contentElement = angular.element('.main-content');
            divElement.mousedown(function(e) {

                e.preventDefault();

                var clickOffset = {
                    left: e.offsetX,
                    top : e.offsetY
                };

                contentElement.mousemove( function(e) {
                    var position = {
                        left: e.pageX - clickOffset.left,
                        top: e.pageY - clickOffset.top
                    };
                    position.top = Math.max(position.top, topBarElement.height());
                    divElement.css(position);
                });
            });

            contentElement.mouseup(function(e) {
                contentElement.off('mousemove');
            });
        }
    };
});
