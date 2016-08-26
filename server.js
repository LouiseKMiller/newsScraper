
//****************************************************************
//           SCRAPER FOR THE ATLANTIC
//           MOST POPULAR ARTICLES
//           WWW.THEATLANTIC.COM/MOST-POPULAR
//****************************************************************


// ***** DEPENDENCIES ************************
// Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');


// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

// ********* DATABASE CONFIGURATION *********
var db = require('./models/db.js');

// ********* EXPRESS CONFIGURATION **********
// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

var routes = require('./routes/routes.js');
app.use('/', routes);

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});







