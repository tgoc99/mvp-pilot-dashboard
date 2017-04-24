var db = require('./db-config.js');
var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
  trip: mongoose.Schema.Types.Mixed,
  days: Number
})

tripSchema.methods.addOne = function(data) {
  var newTrip = new Trip(data);
  newTrip.save(function (err, data){
    if(err) return console.error(err);
    console.log(data);
  })
}

console.log('in the model!');

var Trip = mongoose.model('Trip', tripSchema);

Trip

module.exports = Trip;