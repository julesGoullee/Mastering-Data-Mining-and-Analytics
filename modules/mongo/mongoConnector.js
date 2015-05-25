"use strict";
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/mdma');

module.exports = {
    getConnection : function(){
        return mongoose.connection
    }
};