const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db-config.js')

// Authentication dependencies
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const hash = require('bcrypt-nodejs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./userModel.js');

// Setup express app
const app = express();

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
const routes = require('./routes.js')(app, express);

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Server listening on port:', port)

module.exports = app;