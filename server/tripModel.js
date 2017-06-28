var db = require('./db-config.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//LATER fix this 

var Trip = mongoose.model('Trip', {
  daysToStart: Number,
  days: Number,
  ISOs: mongoose.Schema.Types.Mixed,
  cities: mongoose.Schema.Types.Mixed,
  TZs: mongoose.Schema.Types.Mixed,
  fxCode: mongoose.Schema.Types.Mixed,
  languages: mongoose.Schema.Types.Mixed,
  callingCodes: mongoose.Schema.Types.Mixed,
  fx: mongoose.Schema.Types.Mixed,
  trip: mongoose.Schema.Types.Mixed,
  airports: mongoose.Schema.Types.Mixed
})

module.exports = Trip;