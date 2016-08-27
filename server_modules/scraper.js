//****************************************************************
//           SCRAPER FOR THE ATLANTIC
//           MOST POPULAR ARTICLES
//           WWW.THEATLANTIC.COM/MOST-POPULAR
//****************************************************************

// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

module.exports = function(titles, cb)
{
// global variables
  var result = [];
  var i=0;
  var j=0;



  // Make a request call for the "most-popular" page on theatlantic.com website. 
  // the page's html gets saved as the callback's third arg
  request('http://www.theatlantic.com/most-popular/', 

    //**************CALLBACK FUNCTON HANDLING RESPONSE AFTER IT IS RECEIVED
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
          var imgPath = $(element).find('img').attr('data-src');

          // link to heading is in <h2> element nested in <a> element
          var title = $(element).find('a').find('h2').text();
           
          if (titles.indexOf(title) == -1) {
            // save these results in an object that we'll push
            // into the result array we defined earlier
            result.push({
              title:title,
              link:link,
              imagePath:imgPath,
              imageType:""
            });
          } else {
            console.log("scraped article already in database");
          };
        }); // END OF CHEERIO ITERATION THROUGH MOST-POPULAR PAGE
        console.log("***before getText, length is ", result.length)
      // NOW WE GATHER THE TEXT OF EACH ARTICLE BY MAKING REQUEST CALLS 
      // FOR EACH ARTICLE FOUND ON THE MOST-POPULAR PAGE
      // USING THE LINKS IN THE RESULT ARRAY
        i = 0;
        // start up the recursive function for synchronous operation
        getText(cb);


      function getText(cb){
        if (i < result.length){
          var articleURL = "http://www.theatlantic.com" + result[i].link;       
          request(articleURL, function (error,response,html) {
            if (error) {
              console.log("ERROR IN REQUEST FOR FULL ARTICLE TEXT", error);
            } else {
              var $ = cheerio.load(html);
              var articleText = "";

              // article text in <p> elements following div with article-body class
              $('.article-body').find('p').each(function(i,element){
                articleText = articleText +  $(element).text() + '&nbsp;';
              });

              result[i].text=articleText;
              console.log("full text received for article ", i+1, " of ", result.length);
              // increment counter to avoid endless loop
              i++;
              // call to next loop is not triggered until response received and result array is updated
              getText(cb);
            }; // end of inner IF ERROR ELSE section
          }); // end of inner callback function
        }
        else {
          console.log("completed getting text");
          j=0;
          getImage(cb)
        }
      } // end of getText function



      function getImage(cb){
        if (j<result.length){
          if (!result[j].imagePath) {
            result[j].imagePath = "missing";
            j++;
            getImage();
          } else {
            request(
              {uri: result[j].imagePath, 
               encoding: null},
              function(err, res, body){
                if (error){
                  console.log("ERROR IN REQUEST FOR IMAGE DATA", error);
                } else {
                  console.log('content-type:', res.headers['content-type']);
                  console.log('content-length:', res.headers['content-length']);

                  result[j].imageData = new Buffer(body, 'binary');
                  result[j].imageType = res.headers['content-type'];
                // increment counter to avoid endless loop
                j++;
                // call to next loop not triggered until response received
                getImage(cb);
                }; // end of inner IF ERROR ELSE section
              }); // end of request call back function
          }; //end of if !result[j].imagePath block
        } //end of if j<result.length block
        else {

          // HERE IS WHERE WE EXECUTE THE CALLBACK FUNCTION AND STORE THE RESULT
          // IN THE DATABASE.  SEE ROUTES.JS FILE FOR CALLBACK FUNCTION
          cb(result);
        }
      } // end of getImage function

      }; // end of outer IF ERROR ELSE section
    }); // end of outer callback function

  // **************************
    


} // end of module.exports