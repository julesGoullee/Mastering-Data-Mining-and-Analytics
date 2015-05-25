"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog ){
    $scope.keysWord = [];
    $scope.words = {
        values : {},
        draw : function(){}
    };

    $scope.tweetCount = {
        value: 0
    };

    socket.on( "keysWord", function( keysWord ){
        $scope.keysWord = keysWord;
        $rootScope.showPopup( );
    });

    $rootScope.showPopup = function(){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../dialogChooseTrack/chooseTrack.html'
        }).then(function() {
            //fermeture popup
        }, function() {
            //error
        });

        function DialogController(scope, $mdDialog) {
            scope.addedKeyWord = null;
            scope.selectedKeyWord = null;
            scope.keysWord = $scope.keysWord;

            scope.isValidInput = function( text ){
                if( text.length > 3 && text.indexOf(" ") === -1){

                }
            };

            scope.hide = function() {
                $mdDialog.hide();
            };
            scope.cancel = function() {
                $mdDialog.cancel();
            };
            scope.validate = function() {

                if( scope.addedKeyWord &&  scope.addedKeyWord.name && scope.addedKeyWord.lang &&  scope.addedKeyWord.occurence ){
                    socket.emit( "setNewKeyWord", {
                        newKeyWord: scope.addedKeyWord.name,
                        options:{
                            occurence: scope.addedKeyWord.occurence,
                            lang: scope.addedKeyWord.lang
                        }
                    });
                    $mdDialog.hide();
                }
                else if( scope.selectedKeyWord !== null ) {
                    socket.emit( "setAlreadyTrackKeyWord", scope.selectedKeyWord );
                    $mdDialog.hide();
                }
                else {
                    //todo erreur
                }
            };
        }
    };

    socket.on("representation", function( representationData ){
        $scope.words.values = representationData.words;
        $scope.words.draw();
    });

    socket.on("newWord", function( wordObject ){

        $scope.words.addWord( wordObject );

    });

    socket.on("tweetCount", function(tweetCount){
        $scope.tweetCount.value = tweetCount;
    });
});

angularApp.controller("RightCtrl", function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav("right").close()
            .then(function () {
                $log.debug("close RIGHT is done");

            });
    };
});