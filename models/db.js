// Database configuration
// using mongoose 
var mongoose = require('mongoose');

// Build the connection string
// connection for database scrappingdb on server localhost
// default port is 27017
// option: var dbURI = 'mongodb://localhost:80/scrappingdb'
// option for limiting access to particular user
//     var dbURI = 'mongodb//username:password@localhost/scrappingdb'

var dbURI = 'mongodb://localhost/scrappingdb';

// Create the database connection
// can add options in JSON object as second parameter
// var dbOptions = {'user':'db_username','pass':'db_password'};
//     other options db, server, replset
// mongoose.connect(dbURI, dbOptions);
mongoose.connect(dbURI);

// variable for mongoose connection
var db = mongoose.connection;

// connection process in Mongoose inherits the Node EventEmitter class, so we can set certain code to run following specific events.  Connection events send a callback to the connection.on event listener.

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

db.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

// send disconnection as callback to Node's process.on('SIGINT') event

process.on('SIGINT', function(){
	db.close(function(){
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

module.exports = db;