"use strict";

module.exports = {
    guid: function() {

        return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 );
    }
};