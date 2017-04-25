var mongoose = require('mongoose');
var config = require('../config.js');

//mongoose.connect('mongodb://localhost/pilotdb');
mongoose.connect(`mongodb://${config.user}:${config.pass}@ds119151.mlab.com:19151/mvp`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected!')
});

module.exports = db;
