
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

// import Node File System module method-override - lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
var methodOverride = require('method-override');
var path = require('path');

// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

// ********* DATABASE CONFIGURATION *********
var db = require('./models/db.js');

// ********* EXPRESS CONFIGURATION **********
// use morgan to log express activities
app.use(logger('dev'));


// ====================================================
// Serve static content for the app from the "public" directory in the application directory.
// express.static is express's (only) built-in middleware
// It is used to serve static files such as images and html, css and js files.
// The process.cwd method return the current working directory of the node.js process
app.use(express.static(process.cwd() + '/public'));
//app.use(bodyParser.json());  // middleware that only parses JSON
app.use(bodyParser.urlencoded({extended: false})); // middleware that only parses urlencoded bodies.
     // extended set true so parsing with qs library.  Allows for rich objects and arrays to be
     // encoded into the URL-encoded format.
//app.use(bodyParser.text());  // middleware that parses all bodies as string
//app.use(bodyParser.json({type:'application/vnd.api+json'})); // the type option is used to determine

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// create an instance of express handlebars
// this allows access to the full API
//
var exphbs = require('express-handlebars');
// tell express to use handlebars as a template engine
// A template engine enables you to use static template files
// in your application.  At runtime, the template engine replaces
// variables in a template file with actual values, and transforms the template
// in to an HTML file sent to the client.
// app.engine(ext, callback) method allows you to create your own template engine
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
// register the template engine
app.set('view engine', 'handlebars');

var routes = require('./routes/routes.js');
app.use('/', routes);

// listen on port 3000
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('App running on port', PORT);
});







