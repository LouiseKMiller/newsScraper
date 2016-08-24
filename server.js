
//****************************************************************
//           SCRAPER FOR THE ATLANTIC
//           MOST POPULAR ARTICLES
//           WWW.THEATLANTIC.COM/MOST-POPULAR
//****************************************************************


// Dependencies
// Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');

// Database configuration
// using mongoose 
var mongoose = require('mongoose');

// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));



// Database configuration with mongoose
mongoose.connect('mongodb://localhost/scrappingdb');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});







// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
