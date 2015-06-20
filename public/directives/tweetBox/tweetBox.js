"use strict";

angularApp.directive( "tweetBox",
    function( socket, representation ){
    return {
        restrict: "E",
        scope: {},
        templateUrl:"directives/tweetBox/tweetBox.html",
        link: function( scope, element ) {

            scope.visible = false;
            scope.isLoading = false;
            var currentWord = { id: null };

            var tweetsContainer = element.find("#tweet-container");

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
                //scope.tweets = tweets;
                tweetsContainer.empty();
                scope.isLoading = true;
                for( var i = 0; i < tweets.length; i++ ){
                    (function(i) {
                        var tweet = tweets[i];
                        twttr.widgets.createTweet(
                            tweet.id,
                            tweetsContainer[0],
                            {
                                align: 'left'
                            })
                            .then(function (el) {
                                if( i === tweets.length -1 ){
                                    scope.isLoading = false;
                                }
                            });
                    })(i);
                }
            });

            scope.$on("openTweetBox", function( event, word ){
                if( currentWord.id !== word.id ){
                    currentWord = word;
                    fillBoxWithTweets( word.id );
                    scope.show();
                }
            });

            // Drag&Drop
            var divElement = angular.element(".tweet-box");
            var topBarElement = angular.element("#topBar");
            var contentElement = angular.element(".main-content");
            divElement.mousedown(function(e) {

                if(e.which !== 1) return; // ignore right click

                e.preventDefault();

                var clickOffset = {
                    left: e.offsetX,
                    top : e.offsetY
                };

                contentElement.mousemove( function( e ){
                    var position = {
                        left: e.pageX - clickOffset.left,
                        top: e.pageY - clickOffset.top
                    };
                    position.top = Math.max( position.top, topBarElement.height() );
                    divElement.css( position );
                });
            });

            contentElement.mouseup(function(e) {
                contentElement.off( "mousemove" );
            });
        }
    };
});
