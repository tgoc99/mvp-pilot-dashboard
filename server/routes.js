const tripModel = require('./tripModel.js');
const country = require('countryjs');
const currencies = require('currencies');
const config = require('../config.js');
const helpers = require('./helpers');
const request = require('request');
const rp = require('request-promise');
const passport = require('passport');
const User = require('./userModel.js');
const mongoose = require('mongoose');


module.exports = function (app, express) {

  // AUTHENTICATION
  app.post('/register', function(req, res) {
    console.log('attempting to register', req.body.username, req.body.password);

    User.register(new User({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }

      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
  });

  app.post('/login', passport.authenticate('local'), function(req, res, next) {
      res.redirect('/');
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });


  // TRIPS
  app.get('/trips', function(req,res){
    tripModel.find(function(err, trips){
    if(err) return console.error(err);
      res.send(trips);
    })
  })

  app.post('/trips', function(req,res){
    console.log('session info post /trips', req.session.passport.user);
    console.log('attempting to create trip', req.body);

    let weatherData = [];
    let airportData = [];
    let tripData = req.body;
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
            let startDate = new Date(tripData.startDate);
            let secondStart = new Date(tripData.secondStart);

            for(let i =0; i<= tripData.days; i++){
              let date = helpers.setDay(startDate, i);
              let city;
              if(date<secondStart){
                city = tripData.cities[0];
              } else {
                city = tripData.cities[1];
              }
              tripData.trip['day'+i] = {date:date, city: city, weather:'TBD'};
            }

            // SETTING THE WEATHER FOR EACH DAY
            // use td to change airports
            let td = 0;

            for(i=0;i<=tripData.days;i++){
              if(tripData.trip['day'+i].date >= secondStart) td = 1;
              tripData.trip['day'+i]['weather'] = weatherData[td][i+tripData.daysToStart];
            }


            // PUTTING INTO THE DB
            let newTrip = new tripModel(tripData);
            User.findOneAndUpdate(
              {username: username},
              {$push:{'trips': tripData}},
              {safe: true, upsert: true, new : true},
              function (err, trip){
                if(err) return console.error(err);
                console.log('added to db: weather', trip.trip.day0.weather);
                res.send(trip);
              }
            )

          })
        })

      })
    })
  })
}
