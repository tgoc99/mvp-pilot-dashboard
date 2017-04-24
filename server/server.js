var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

var port = 3000;
app.listen(port);
console.log('Server listening on port:', port)


app.post('/trips', function(req,res){
  console.log(req.body);
  res.send('success')
})

module.exports = app;