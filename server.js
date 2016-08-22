/* Scraper: Server #1  (18.2.1) 
 * ========================= */

// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html


// Make a request call for the "most-popular" page on theatlantic.com website. 
// the page's html gets saved as the callback's third arg
request('http://www.theatlantic.com/most-popular/', function (error, response, html) {
  
  // Load the html into cheerio and save it to a var.
  // '$' becomes a shorthand for cheerio's selector commands, 
  //  much like jQuery's '$'.
  var $ = cheerio.load(html);

  // an empty array to save the data that we'll scrape
  var result = [];


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
      image:image,
      text:""
    });

  });


  for (var i=0; i<3; i++){
    console.log("beginning of loop i", i);
    var articleURL = "http://www.theatlantic.com" + result[i].link;
    console.log("title", result[i].title);
    console.log("text", getText(articleURL));
    
  };

  function getText(url, i){
    // go to page with full article text
    request(url, function (error,response,html) {
      var $ = cheerio.load(html);
      var articleText = "";

      // article text in <p> elements following div with article-body class
      $('.article-body').find('p').each(function(i,element){
        articleText = articleText + $(element).text();
      });

    result[i].text=articleText;
    console.log(result[i].text);
    }); // end of request
  }; // end of function
  
})
  