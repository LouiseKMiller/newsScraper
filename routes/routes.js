// Routes
// ======
// Bring in our Note and Article models

var express = require('express');
var router = express.Router();


var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

var scraper = require('../server_modules/scraper.js');

// Simple index route
router.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the echojs website.
router.get('/scrape', function(req, res) {
  // run the scraper module
  // call back function saves result of scraper function into database
  scraper(function(result){
    for (var i=0; i<result.length; i++){
    // using our Article model, create a new entry.
      var entry = new Article (result[i]);

      // now, save that entry to the db
      entry.save(function(err, doc) {
        // log any errors
        if (err) {
          console.log(err);
        } 
        // or log the doc
        else {
          console.log(doc);
        }
      }); 
    } 
  });
  // tell the browser that we finished scraping the text.
  res.send("Scrape Complete");
});

// this will get the articles we scraped from the mongoDB
router.get('/articles', function(req, res){
  // grab every doc in the Articles array
  Article.find({}).select('title link').exec(function(err, doc){
    // log any errors
    if (err){
      console.log(err);
    } 
    // or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// grab an article by it's ObjectId
router.get('/articles/:id', function(req, res){
  // using the id passed in the id parameter, 
  // prepare a query that finds the matching one in our db...
  Article.findOne({'_id': req.params.id})
  // and populate all of the notes associated with it.
  .populate('note')
  // now, execute our query
  .exec(function(err, doc){
    // log any errors
    if (err){
      console.log(err);
    } 
    // otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/articles/:id', function(req, res){
  // create a new note and pass the req.body to the entry.
  var newNote = new Note(req.body);

  // and save the new note the db
  newNote.save(function(err, doc){
    // log any errors
    if(err){
      console.log(err);
    } 
    // otherwise
    else {
      // using the Article id passed in the id parameter of our url, 
      // prepare a query that finds the matching Article in our db
      // and update it to make it's lone note the one we just saved
      Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

module.exports = router;
