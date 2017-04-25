var db = require('./db-config.js');
var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  daysToStart: Number,
  trip: mongoose.Schema.Types.Mixed,
  airports: mongoose.Schema.Types.Mixed,
  cities: mongoose.Schema.Types.Mixed,
  days: Number
})

console.log('in the model!');

var Trip = mongoose.model('Trip', tripSchema);

Trip

module.exports = Trip;