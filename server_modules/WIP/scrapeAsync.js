//****************************************************************
//           SCRAPER FOR THE ATLANTIC
//           MOST POPULAR ARTICLES
//           WWW.THEATLANTIC.COM/MOST-POPULAR
//****************************************************************

// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html
var fs = require('fs');

// global variables
var result = [];


function scrape(){
// Make a request call for the "most-popular" page on theatlantic.com website. 
// the page's html gets saved as the callback's third arg
  request('http://www.theatlantic.com/most-popular/', function(error, response, html) {

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
          // load image binary data into imgData
          var imgData = fs.readFileSync(imgPath);

          // link to heading is in <h2> element nested in <a> element
          var title = $(element).find('a').find('h2').text();
           
          // save these results in an object that we'll push
          // into the result array we defined earlier
          console.log("i", i);
          result[i]={
            title: title,
            link: link,
            imgPath: imgPath,
            img: {
              data: imgData,
              contentType: 'image/png';
            }
          };
          var articleURL = "http://www.theatlantic.com" + result[i].link;
          getText(articleURL,i); 

        }); // END OF CHEERIO ITERATION THROUGH MOST-POPULAR PAGE

      }; // end of outer IF ERROR ELSE section

    }); // end of outer callback function

  // **************************
} // end of scrape function
    
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
        });

        result[i].text=articleText;
        console.log("full text received for article ", i+1, " of ", result.length);
      } // end of IF ERROR ELSE section
    }); // end of request for url html
  }; // end of getText function  

scrape();