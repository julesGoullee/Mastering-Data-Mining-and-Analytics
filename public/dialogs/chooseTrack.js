"use strict";

angularApp.controller("ChooseTrackController", function( $scope, $rootScope, $mdDialog, $timeout, socket, keysWord ){
    $scope.addedKeyWord = null;
    $scope.selectedKeyWord = null;

    $timeout(function() {
        angular.element('#keywordInput').focus();
    }, 500);

    $scope.isValidInput = function( text ){
        if( text.length > 3 && text.indexOf(" ") === -1 ){

        }
    };

    $scope.hide = function(){
        $mdDialog.hide();
    };

    $scope.cancel = function(){
        $mdDialog.cancel();
    };

    $scope.validate = function(){

        $scope.tried = true;
        if( $scope.addedKeyWord &&  $scope.addedKeyWord.name &&  $scope.addedKeyWord.occurence ){

            if( !$scope.addedKeyWord.lang ){
                $scope.addedKeyWord.lang = 'fr';
            }

            socket.emit( "setNewKeyWord", {
                newKeyWord: $scope.addedKeyWord.name,
                options:{
                    occurence: $scope.addedKeyWord.occurence,
                    lang: $scope.addedKeyWord.lang
                }
            });

            $scope.$on( "newKeyWord", function( event,  word ){
                if( word.value === $scope.addedKeyWord.name ){
                    word.isMine = true;
                    keysWord.currentKeyWord( word.id );
                    socket.emit( "setAlreadyTrackKeyWord", word.id );
                }
            });

            $mdDialog.hide();
        }
        else {
            //todo erreur
        }
    };
});