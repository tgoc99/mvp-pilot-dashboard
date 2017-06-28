var Promise = require("bluebird");
var request = require('request');
Promise.promisifyAll(request);
var rp = require('request-promise');
var config = require('../config.js');



exports.setDay = function (date, days){
  newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate;
}



