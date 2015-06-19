"use strict";
angularApp.service("graphConfig",function($rootScope){
    var _callbackHiddenNodes = [];

    var gravity = {
        enabled: true,
        value: 1
    };

    return {
        gravity: gravity,
        restoreHiddenNodes: function(){
            for( var i = 0; i < _callbackHiddenNodes.length; i++ ){
                _callbackHiddenNodes[i]();
            }
        },
        onRestoreHiddenNodes: function( callback ){
            _callbackHiddenNodes.push( callback );
        }
    }
});