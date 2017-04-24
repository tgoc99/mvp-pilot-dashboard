var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/pilotdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected!')
});

module.exports = db;
