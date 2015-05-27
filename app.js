var VERSION = 'V0.5';
var assert = require('assert');
var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var	sprintf = require("sprintf-js").sprintf;
var dbUrl = require('../dbUrl.js');
//
// Database code. Note for security purposes the url is maintained
// in a file in the parent directory.
//
var url = dbUrl.dbUrl();
var MongoClient = require('mongodb').MongoClient;
var routes = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
var about = require('./routes/about');
var admin = require('./routes/admin');
var statistics = require('./routes/statistics');

var app = express();
/*
 * Global object used to store application-specific information.
 */
demoApp = {
	stats : {
		nAttempts: 0,
		nCorrect: 0,
		percent: 0},
	db: {},
	systemStart : new Date(),
	version: VERSION,
	questions: new Array()
}
/*
 * Cache-in the question database for quick access.
 */
getQuestions(global.demoApp.questions);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/test', test);
app.use('/about', about);
app.use('/admin', admin);
app.use('/statistics', statistics);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
/*
 * Get the questions & answers from the database and cache for future use.
 */
function getQuestions(questions) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log('connected to database');
		global.demoApp.db = db;
		global.demoApp.db.collection("questions").find({}).toArray(function(err, items) {
			assert.equal(null, err);
			for(var i = 0; i < items.length; i++) {
				global.demoApp.questions.push(items[i]);
			}
			global.demoApp.questions = items;
		});
		global.demoApp.db.collection('attempts').find({}).count(function(err, count) {
			if(err != null) {
				console.log('cannot get nAttempts: ' + err);
			} else {
				global.demoApp.stats.nAttempts = count;
			}
		});
		global.demoApp.db.collection('attempts').find({success:true}).count(function(err, nCorrect) {
			if(err != null) {
				console.log('cannot get nCorrect: ' + err);
			} else {
				global.demoApp.stats.nCorrect = nCorrect;
			}
		});
	});
}