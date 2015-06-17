"use strict";

module.exports = {
    guid: function() {

        return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 );
    },
    dateNow: function(){
        var objToday = new Date();
        var dayOfMonth = (objToday.getDate() < 10) ? "0" + objToday.getDate() : objToday.getDate() ;
        var curHour = objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours();
        var curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes();
        var curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds();

        return curHour + "h:" + curMinute + "m:" + curSeconds  + "s " + dayOfMonth + "/" + objToday.getMonth();
    }
};