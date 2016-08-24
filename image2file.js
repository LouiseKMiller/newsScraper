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
var fileName = "image1.png"

download = function(uri, filename, callback){
  console.log("before request.head");
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}


app.get('/photo', function(req, res){
  console.log("request received");
  download(imgPath, fileName, function(){
    console.log('done');
    res.sendFile(__dirname +'/image1.png');
  });
});

// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});



// // connect to mongo
// mongoose.connect('localhost', 'testing_storeImg');

// // example schema
// var schema = new Schema({
//     img: { data: Buffer, contentType: String }
// });

// // our model
// var A = mongoose.model('A', schema);

// mongoose.connection.on('open', function () {
//   console.error('mongo is open');

//   // empty the collection
//   A.remove(function (err) {
//     if (err) throw err;

//     console.error('removed old docs');

//     // store an img in binary in mongo
//     var a = new A;
//     a.img.data = fs.readFileSync(imgPath);
//     a.img.contentType = 'image/png';
//     a.save(function (err, a) {
//       if (err) throw err;

//       console.error('saved img to mongo');

//       // start a demo server
//       var server = express.createServer();
//       server.get('/', function (req, res, next) {
//         A.findById(a, function (err, doc) {
//           if (err) return next(err);
//           res.contentType(doc.img.contentType);
//           res.send(doc.img.data);
//         });
//       });

//       server.on('close', function () {
//         console.error('dropping db');
//         mongoose.connection.db.dropDatabase(function () {
//           console.error('closing db connection');
//           mongoose.connection.close();
//         });
//       });

//       server.listen(3000, function (err) {
//         var address = server.address();
//         console.error('server listening on http://%s:%d', address.address, address.port);
//         console.error('press CTRL+C to exit');
//       });

//       process.on('SIGINT', function () {
//         server.close();
//       });
//     });
//   });

// });