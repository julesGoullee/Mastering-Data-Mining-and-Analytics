"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");

mongoose.connect( "mongodb://" + config.api.mongo.ip + "/" + config.api.mongo.base );

module.exports = {
    getConnection : function(){
        return mongoose.connection
    }
};