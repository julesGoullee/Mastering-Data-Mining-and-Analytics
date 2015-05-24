"use strict";
angularApp.service("graphConfig",function(){
    var _callbackHiddenNodes = [];

    return{
        gravity:{value: 0.1 },
        restoreHiddenNodes : function(){
            for( var i = 0; i < _callbackHiddenNodes.length; i++ ){
                _callbackHiddenNodes[i]();
            }
        },
        onRestoreHiddenNodes : function( callback ){
            _callbackHiddenNodes.push( callback );
        }
    }
});