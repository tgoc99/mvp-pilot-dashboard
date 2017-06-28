var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./db-config.js')

// Authentication dependencies
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./userModel.js');

// Setup express app
var app = express();

// Setup middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
  secret: 'chooseSecret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve Static
app.use(express.static(__dirname + '/../client'));

//Configure Passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES in separate file
var routes = require('./routes.js')(app, express);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening on port:', port)

module.exports = app;