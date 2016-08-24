/**
 * Module dependencies
}); */

var request = require('request');


var express = require('express');
var app = express();



var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = 'https://cdn.theatlantic.com/assets/media/img/mt/2016/08/AP_97123101654/300.jpg?1471966371';





// connect to mongo
mongoose.connect('mongodb://localhost/scrappingdb');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var Schema = mongoose.Schema;

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

    var A = mongoose.model('A', schema);

request(
  {uri: imgPath, 
   encoding: 'binary'},
  function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    body = new Buffer(body, 'binary');

    // show any mongoose errors
    mongoose.connection.on('error', function(err) {
      console.log('Mongoose Error: ', err);
    });
// our model


      // empty the collection
      A.remove(function (err) {
        if (err) throw err;

        console.log('removed old docs');

        // store an img in binary in mongo
        var a = new A;
        a.img.data = body;
        a.img.contentType = res.headers['content-type'];
        a.save(function (err, a) {
          if (err) throw err;

          console.log('saved img to mongo');


      // start a demo server

          app.get('/', function (req, res, next) {
            A.findById(a, function (err, doc) {
              if (err) return next(err);
              res.contentType(doc.img.contentType);
              res.send(doc.img.data);
            });
          });

        });
      });


    });

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});

