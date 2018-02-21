
//anything that is connected once

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');//figure out what this does
var logger = require('morgan');//figure out what this does
var cookieParser = require('cookie-parser');//figure out what this does
var bodyParser = require('body-parser');//be able to get form data
var session = require('client-sessions');//be able to have cookie data persist
var mongoose = require("mongoose");//be able to use the database
var user = require("./models/users.js")//user schema


var index = require('./routes/index');//things people can see when they are not logged in 
//var users = require('./routes/users'); might not need it
var admin = require('./routes/admin');//only when you're already login

var app = express();


//database connection
mongoose.connect("mongodb://localhost/test");//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('CONNECTED ON DATABASE');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//what does this do?
app.use(bodyParser.json());//alows the user to parse their json
app.use(bodyParser.urlencoded({ extended: false }));//alows urlencoded parsing
app.use(cookieParser());//Idk why I need this
app.use(express.static(path.join(__dirname, 'public')));//uses public for files that people can seee

//sets the session as to where to set-cookie
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


//checks if there is a user otherwise  it just goes next
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    user.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
        req.user = user.toObject();
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        
        res.locals.user = user;

      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

app.use('/admin',admin);//after the person is authenticated they should be able to go through these routes
//app.use('/users', users);
app.use('/', index);//if they are not login they can access this
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
