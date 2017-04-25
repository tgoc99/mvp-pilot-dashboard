var Promise = require("bluebird");
var request = require('request');
Promise.promisifyAll(request);
var rp = require('request-promise');
var config = require('../config.js');

exports.getAsync = function(item){
  request.getAsync(`http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/q/${item}.json`)
  .then(body => {
    console.log('api response:', body)
  })
}

exports.get = function(item){
  request.get(`http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/q/${item}.json`, function(err,response,body){
    console.log(body);
  })
}

exports.getAsyncRP = function(item){
  return new Promise ((resolve) =>{ rp({
      uri: `http://api.wunderground.com/api/${config.weatherAPI}/forecast10day/q/${item}.json`,
      json: true // Automatically parses the JSON string in the response 
    })
    .then(function(data){
      console.log('getOneRP:', data.forecast.simpleforecast.forecastday);
      return data.forecast.simpleforecast.forecastday
    })
  })
}

exports.getAsyncArray = function(array) {
  var cities = [];
  array.forEach(function(airport) {
    cities.push(exports.getAsyncRP(airport))
  })
  Promise.all(cities)
  .then(function() {
    console.log('DONE')
  })
}


