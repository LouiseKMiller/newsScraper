// Routes
// ======
// Bring in our Note and Article models

var express = require('express');
var router = express.Router();
var path = require('path');
var methodOverride = require('method-override');



var db = require('../models/db.js');
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

var scraper = require('../server_modules/scraper.js');

// Simple index route
router.get('/', function(req, res) {
  res.redirect('/home');
});

// ============================================
//    A GET request to scrape the target website.
router.get('/scrape', function(req, res) {
  // to save time, first find titles for all articles already in the database
  // so we don't have to pull old data from the news site again
  var titles=[];
  Article.find({},'title',function(err, titleresult){
    if (err) {
      console.log("error getting titles", err);
    } else {
      // create array of titles to pass on to the scraper module
      for (var i=0; i<titleresult.length; i++){titles.push(titleresult[i].title);};

      // run the scraper module
      // call back function saves result of scraper function into database
      scraper(titles,function(result){
        Article.create(result, function(err, docs){
          if (err){
            console.log(err);
          }
            // log message that documents were saved
          else {
            console.log("documents saved to database");
          };
        }); // end of Article.create
      }); // end of scraper function
    }; // end of if else (err)
  }); // end of Article.find
  // tell the browser that we finished scraping the text.
  res.send("Scrape Complete");
});


// ================================================
// this will get the articles we scraped from the mongoDB
router.get('/home', function(req, res){
  // grab every doc in the Articles array
  Article.find({})
  .select('title link')
  .exec(function(err, doc){
    // log any errors
    if (err){
      console.log(err);
    }
    // or send the doc to the browser as a json object
    else {
      var hbsObject = {doc};
      res.render('home', hbsObject);
    }
  });
});

//=======================================================
// grab an article by it's ObjectId
router.get('/article/:id', function(req, res){
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
      var hbsObject = {doc};
      console.log("console logging doc.note: ", doc.note);
//      res.contentType(doc.imageType);
//      res.send(doc.imageData);
      res.render('article', hbsObject);
    }
  });
});

//=========================================================
// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/newnote/:id', function(req, res){
  // create a new note instance and pass the req.body to the entry.
  var newNote = new Note(req.body);
  console.log('request body in post request', req.body);

  // and save the new note the db
  newNote.save(function(err, doc){
    // log any errors
    if(err){
      console.log(err);
    }
    // otherwise
    else {
      // using the Article id passed in the id parameter of our url,
      //
      Article.findOneAndUpdate({'_id': req.params.id,'note':doc._id})

      // execute the above query
      .exec(function(err, doc){
        // log any errors
        if (err){
          console.log(err);
        } else {
          // or send the document to the browser

          res.redirect('/article/'+req.params.id);
        }
      });
    }
  });
});

//============================================================
// delete a note
router.post('/note/:id', function(req, res){

});

module.exports = router;

// ********************** MODEL METHODS *******************
// FIND A SINGLE INSTANCE (returns first instance)
//  Article.findOne({'title': 'blahblah'}, function(err,article){...})
//
// FIND MANY
//  Model.find(conditions, [fields], [options], [callback])
//  example: Article.find({"title": "x"}, function(err, articles){...})
//  [fields] - fields to return.  set to null if you use options
//  [options] - example {sort: {lastLogin: -1}}
//
// FIND SINGLE INSTANCE BY ID
// Model.findById(ObjectID)
//
// CREATE AND SAVE (use SAVE instance method if you need to do things to dataObject before saving)
// Article.create(dataObject, callback)
//
// Article.update
//
// Article.remove
//
//************************* QUERY BUILDER
// chain commands and end with .exec(callback function)
//
// *********************** INSTANCE METHODS ******************
//  Instance methods operate on the instance rather than the model
//
//  SAVE - SAVING USING THE INSTANCE METHOD
//  var newArticle = new Article({....});
//  newArticle.save( function(err, doc){
//  if(!err){console.log('_id of article saved:', doc.id)};
//    })
//  ** note that doc.id is a string
//  **       doc._id is an ObjectId SchemaType
//  ** also note that you can chain the two ops above
//
//
// *******************USER DEFINED STATIC METHODS ************