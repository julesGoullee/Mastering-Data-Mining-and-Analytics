"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");

mongoose.connect( "mongodb://" + config.api.mongo.ip + "/" + config.api.mongo.base, function( err ){

    if( err ){
        console.error("Mongo connection [FAIL]: " + err.message );
    }
    else{
        console.info("Mongo connection [OK]");
    }
});

module.exports = {
    getConnection : function(){
        return mongoose.connection
    }
};