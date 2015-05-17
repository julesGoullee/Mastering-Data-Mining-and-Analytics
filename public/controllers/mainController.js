"use strict";

angularApp.controller("AppCtrl", function( $scope, $rootScope, socket, $mdDialog ){
    $scope.words = {
        values : {},
        draw : function(){}
    };

    $scope.tweetCount = {
        value: 0
    };

    socket.on( "keysWord", function( keysWord ){
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'controllers/chooseTrack.html'
        }).then(function() {
            //fermeture popup
        }, function() {
            //error
        });

        function DialogController($scope, $mdDialog) {
            $scope.addedKeyWord = null;
            $scope.selectedKeyWord = null;
            $scope.keysWord = keysWord;

            $scope.isValidInput = function( text ){
                if( text.length > 3 && text.indexOf(" ") === -1){

                }
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.validate = function() {

                if( $scope.addedKeyWord ){
                    socket.emit( "setNewKeyWord", $scope.addedKeyWord );
                    $mdDialog.hide();
                }
                else if( $scope.selectedKeyWord !== null ) {
                    debugger;
                    $mdDialog.hide();
                }
                else {
                    //todo erreur
                }
            };
        }
    });

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