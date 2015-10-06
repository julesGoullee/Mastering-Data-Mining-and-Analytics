'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  twitter: {
    id: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true},
    token: { type: String, required: true },
    tokenSecret: { type: String, required: true },
    photo: {
      url: { type: String, required: true }
    }
  }
},{ versionKey: 'version' });

module.exports = mongoose.model('user', userSchema);
