"use strict";
var mongoose = require("mongoose");
var config = require("../../config/config.js");

mongoose.connect('mongodb://'+config.mongo.ip+'/'+config.mongo.base);

module.exports = {
    getConnection : function(){
        return mongoose.connection
    }
};