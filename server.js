
//****************************************************************
//           SCRAPER FOR THE ATLANTIC
//           MOST POPULAR ARTICLES
//           WWW.THEATLANTIC.COM/MOST-POPULAR
//****************************************************************


// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

// global variables
var result = [];

// Make a request call for the "most-popular" page on theatlantic.com website. 
// the page's html gets saved as the callback's third arg
request('http://www.theatlantic.com/most-popular/', 

  //**************CALLBACK FUNCTON HANDLING RESPONSE RECEIVED
  function (error, response, html) {

    if (error) {
      console.log("ERROR in most-popular request call", error);
    } else {
      // Load the html into cheerio and save it to a var.
      // '$' becomes a shorthand for cheerio's selector commands, 
      //  much like jQuery's '$'.
      var $ = cheerio.load(html);

      // With cheerio, find each p-tag with a "title" class
      // (i: iterator. element: the current element)
      $('li.blog-article').each(function(i, element){

        // link to full article text is in <a> element
        var link = $(element).find('a').attr('href');

        // link to image is in <img> element nested in <a> element
        var image = $(element).find('img').attr('data-src');

        // link to heading is in <h2> element nested in <a> element
        var title = $(element).find('a').find('h2').text();
         
        // save these results in an object that we'll push
        // into the result array we defined earlier
        result.push({
          title:title,
          link:link,
          image:image
        });

      }); // END OF CHEERIO ITERATION THROUGH MOST-POPULAR PAGE

    // NOW WE MAKE REQUEST CALLS FOR EACH ARTICLE FOUND ON THE MOST-POPULAR PAGE
    // USING THE LINKS IN THE RESULT ARRAY
    //  
//*      for (var i=0; i<result.length; i++){
//*       var articleURL = "http://www.theatlantic.com" + result[i].link;

      // moved request function to seperate function so that
      // its callback function has correct value of url and i
      // on each pass of the loop
//*        getText(articleURL,i);    
//*      };
      // **  NOTE THAT IF WE USE THE LOOP ABOVE, THE CALLBACK FUNCTION FOR INDIVIDUAL ARTICLES WILL NOT BE COMPLETE
      // **  BY THE END OF THIS FUNCTION
      // **  BUT BENEFIT IS THAT YOU DON'T HAVE TO WAIT FOR IT
      // **  if we need to make sure we have all the content in place, use recursive loop function below
      // **  and get rid of the getText function below
      var i = 0;
      function forloop(){
        if(i<result.length){
          var articleURL = "http://www.theatlantic.com" + result[i].link;       
          request(articleURL, function (error,response,html) {
            if (error) {
              console.log("ERROR IN REQUEST FOR FULL ARTICLE TEXT", error);
            } else {
              var $ = cheerio.load(html);
              var articleText = "";

              // article text in <p> elements following div with article-body class
              $('.article-body').find('p').each(function(i,element){
                articleText = articleText + $(element).text();
              });

              result[i].text=articleText;
              console.log("full text received for article ", i+1, " of ", result.length);
              // increment counter to avoid endless loop
              i++;
              // call to next loop is not triggered until response received and result array is updated
              forloop();
            }; // end of inner IF ERROR ELSE section
          }); // end of inner callback function
        }
        else {
          console.log("completed scraping");
        }
      } // end of forloop function
      // start up the forloop function
      forloop();
      // **  END OF OPTIONAL RECURSIVE LOOP ALTERNATIVE


    }; // end of outer IF ERROR ELSE section
  }); // end of outer callback function

// **************************
  
function getText(url, i){
  // go to page with full article text
  request(url, function (error,response,html) {
    if (error) {
        console.log("ERROR IN REQUEST FOR FULL ARTICLE TEXT", error);
    } else {
      var $ = cheerio.load(html);
      var articleText = "";

      // article text in <p> elements following div with article-body class
      $('.article-body').find('p').each(function(i,element){
        articleText = articleText + $(element).text();

      result[i].text=articleText;
      console.log("full text received for article ", i+1, " of ", result.length);
      });
    } // end of IF ERROR ELSE section
  }); // end of request for url html
}; // end of getText function  

