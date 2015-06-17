"use strict";

module.exports = {
    guid: function() {

        return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 );
    },
    dateToString: function( date ){
        var dayOfMonth = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate() ;
        var curHour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var curMinute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var curSeconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return curHour + "h:" + curMinute + "m:" + curSeconds  + "s " + dayOfMonth + "/" + date.getMonth();
    }
};