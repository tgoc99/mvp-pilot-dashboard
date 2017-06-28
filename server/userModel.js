var db = require('./db-config.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Trip = require('./tripModel.js');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  username: String,
  trips: [Trip.schema]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;
