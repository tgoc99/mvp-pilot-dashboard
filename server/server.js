var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db-config.js');
var Model = require('./model.js');
var helpers = require('./helpers');
var config = require('../config.js');



// to run rp without helper
var request = require('request');
var rp = require('request-promise');

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

  var weatherData = [];
  var tripData = req.body;
  // console.log('body:', req.body);
  // helpers.getAsyncArray(req.body.airports)

  rp({
    uri: `http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/q/${req.body.airports[0]}.json`,
    json: true // Automatically parses the JSON string in the response 
  })
  .then(function(data){
    weatherData.push(data.forecast.simpleforecast.forecastday)
    // console.log('getOneRP:', data.forecast.simpleforecast.forecastday);
    // return data.forecast.simpleforecast.forecastday
    rp({
      uri: `http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/q/${req.body.airports[1]}.json`,
      json: true // Automatically parses the JSON string in the response 
    })
    .then(function(secondData){
      // console.log('sd:', secondData);
      weatherData.push(secondData.forecast.simpleforecast.forecastday)
      // console.log('wd:', weatherData)
      console.log('wd:pretty date', new Date(weatherData[0][0].date.epoch*1000));
      var wdStartDate = new Date(weatherData[0][0].date.epoch*1000);
      var tripStartDate = tripData.trip.day0.date;
      var daysToStart = tripData.daysToStart;
      var secondStart = tripData.secondStart;

      // use td to change airports
      var td = 0;

      for(i=0;i<=tripData.days;i++){
        if(tripData.trip['day'+i].date >= secondStart) td = 1;
        tripData.trip['day'+i]['weather'] = weatherData[td][i+daysToStart];
      }

      // STILL NEED TO CHANGE THE WEATHER BY THE DATE BASED ON TRIP SCHEDULE

      var newTrip = new Model(tripData);
      newTrip.save(function (err, trip){
        if(err) return console.error(err);
        console.log('added to db: weather', trip.trip.day0.weather);
      })
      res.send('success')


      // HERE - Manipulate weatherData
    })
  })

})

module.exports = app;