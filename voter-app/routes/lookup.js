
var url = require('url');
var http = require('http');
var Q = require('q');

var BASE_URL = 'http://ws.spotify.com/';
var LOOKUP_URL = BASE_URL + 'lookup/1/.json';

exports.lookup = function(req, resp) {
  // console.log('searching by track');
  var uri = new String(req.query.uri);
  if (!uri) {
    resp.writeHead(400, {'Content-Type':'application/json'});
    resp.write(JSON.stringify({errorCode:'error.request.nouri'}));
    return;
  }

  var requestUrl = LOOKUP_URL + '?uri=' + uri;
  if (uri instanceof String && uri.indexOf('spotify:artist') >= 0) {
    requestUrl += '&extras=album'
  }
  else if (uri instanceof String && uri.indexOf('spotify:album') >= 0) {
    requestUrl += '&extras=track'
  }

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