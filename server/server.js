var express = require('express');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db-config.js');
var Model = require('./model.js');
var helpers = require('./helpers');
var config = require('../config.js');
var country = require('countryjs');
var currencies = require('currencies');

// to run rp without helper
var request = require('request');
var rp = require('request-promise');

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

var port = process.env.PORT || 3000;
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
  var airportData = [];
  var tripData = req.body;
  tripData.trip = {};

  // Update currencies
  currencies.update(function(err, newCurrencies) {
    newCurrencies['USD'].rate === 1
  });

  rp({
    uri: `http://api.wunderground.com/api/${config.weatherAPI}/geolookup/q/${req.body.airports[0]}.json`,
    json: true // Automatically parses the JSON string in the response 
  })
  .then(function(locData){
    airportData.push(locData.location)
    rp({
      uri: `http://api.wunderground.com/api/${config.weatherAPI}/geolookup/q/${req.body.airports[1]}.json`,
      json: true // Automatically parses the JSON string in the response 
    })
    .then(function(locData2){
      airportData.push(locData2.location)
      rp({
        uri: `http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/${airportData[0].l}.json`,
        json: true // Automatically parses the JSON string in the response 
      })
      .then(function(data){
        weatherData.push(data.forecast.simpleforecast.forecastday)
        rp({
          uri: `http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/${airportData[1].l}.json`,
          json: true // Automatically parses the JSON string in the response 
        })
        .then(function(secondData){
          weatherData.push(secondData.forecast.simpleforecast.forecastday);

          // SETTING THE ISO DATA , CITIES, TIME ZONE,
          tripData.ISOs = [airportData[0].country_iso3166, airportData[1].country_iso3166];
          tripData.cities = [airportData[0].city, airportData[1].city];
          tripData.TZs = [airportData[0].tz_long, airportData[1].tz_long];
          tripData.fxCode = [country.currencies(tripData.ISOs[0])[0], country.currencies(tripData.ISOs[1])[0]];
          tripData.languages = [country.languages(tripData.ISOs[0])[0], country.languages(tripData.ISOs[1])[0]];
          tripData.callingCodes = [country.callingCodes(tripData.ISOs[0])[0], country.callingCodes(tripData.ISOs[1])[0]];
          tripData.fx = [currencies.get(tripData.fxCode[0]).rate, currencies.get(tripData.fxCode[1]).rate];

          // SETTING THE CITIES FOR EACH DAY
          var startDate = new Date(tripData.startDate);
          var secondStart = new Date(tripData.secondStart);

          for(var i =0; i<= tripData.days; i++){
            var date = helpers.setDay(startDate, i);
            var city;
            if(date<secondStart){
              city = tripData.cities[0];
            } else {
              city = tripData.cities[1];
            }
            tripData.trip['day'+i] = {date:date, city: city, weather:'TBD'};
          }

          // SETTING THE WEATHER FOR EACH DAY
          // use td to change airports
          var td = 0;

          for(i=0;i<=tripData.days;i++){
            if(tripData.trip['day'+i].date >= secondStart) td = 1;
            tripData.trip['day'+i]['weather'] = weatherData[td][i+tripData.daysToStart];
          }


          // PUTTING INTO THE DB
          var newTrip = new Model(tripData);
          newTrip.save(function (err, trip){
            if(err) return console.error(err);
            console.log('added to db: weather', trip.trip.day0.weather);
            res.send(trip);
          })

        })
      })

    })
  })
})

module.exports = app;