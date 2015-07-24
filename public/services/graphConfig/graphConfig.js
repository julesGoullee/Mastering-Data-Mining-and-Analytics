"use strict";
angularApp.service("graphConfig",function(){
    var _callbackHiddenNodes = [];

    var gravity = {
        enabled: true,
        value: 0.2
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

angularApp.service("ga",function(){
    return  window.ga || function(){};
});