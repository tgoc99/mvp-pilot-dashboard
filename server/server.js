var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db-config.js');
var Model = require('./model.js');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

var port = 3000;
app.listen(port);
console.log('Server listening on port:', port)

app.get('/trips', function(req,res){
  Model.find(function(err, trips){
  if(err) return console.error(err);
    res.send(trips);
  })
})

app.post('/trips', function(req,res){
  console.log('body:', req.body);
  var newTrip = new Model(req.body);
  newTrip.save(function (err, trip){
    if(err) return console.error(err);
    console.log(trip);
  })
  res.send('success')
})

module.exports = app;