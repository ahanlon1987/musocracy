
var url = require('url');
var http = require('http');
var Q = require('Q');

var BASE_URL = 'http://ws.spotify.com/';
var SEARCH_URL = BASE_URL + 'search/1/track.json';

exports.byTrack = function(req, resp) {
  // console.log('searching by track');
  var query = req.query.q;
  if (!query) {
    query = 'kanye';
  }

  var requestUrl = (SEARCH_URL + '?q=' + query);
  // console.log('Request Url: ' + requestUrl);
  http.get(requestUrl, function(response){
    // console.log('Got Response', response);
    var respData = '';
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      // console.log('Data Received: ' + chunk);
      respData += chunk;
    });

    response.on('end', function() {
      var respObj = JSON.parse(respData);
      // console.log(respData);

      resp.writeHead(200, {'Content-Type':'application/json'});
      resp.write(JSON.stringify(respObj));
      resp.end();
    });
  })

}
