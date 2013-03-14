
var url = require('url');
var http = require('http');
var Q = require('q');
var _ = require('underscore');


var BASE_URL = 'http://ws.spotify.com/';

var SEARCH_URLS = {
  track: BASE_URL + 'search/1/track.json',
  artist: BASE_URL + 'search/1/artist.json',
  album: BASE_URL + 'search/1/album.json'
}

var doSearch = function(type, req, resp) {
  // console.log('searching by track');
  var query = req.query.q;
  if (!query) {
    query = 'kanye';
  }

  var requestUrl = SEARCH_URLS[type] + '?q=' + query;
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
//      console.log(respData);

      var info  = respObj.info;

     //Clean up the search result to only bring back what we need: id, name, artist(s), album.
      var formattedTracks = [];
      if (respObj.tracks){
          _.each(respObj.tracks, function(track){
              var trackId = track.href;
              var name = track.name;
              var artists = '';
              var delim = ' ';
              _.each(track.artists, function(artist){
                  artists += delim + artist.name;
                  delim = ', ';
              });
              var album = track.album ? track.album.name : '';

              formattedTracks.push({
                  "trackId":trackId,
                  "name":name,
                  "artists":artists,
                  "album":album
              })

          });
      }

      resp.writeHead(200, {'Content-Type':'application/json'});
      resp.write(JSON.stringify({"info":info, "playlist":formattedTracks}));
      resp.end();
    });
  })
}

exports.byTrack = function(req, resp) {
  doSearch('track', req, resp);
}

exports.byArtist = function(req, resp) {
  doSearch('artist', req, resp);
}

exports.byAlbum = function(req, resp) {
  doSearch('album', req, resp);
}