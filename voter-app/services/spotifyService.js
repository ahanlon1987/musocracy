
var url = require('url');
var http = require('http');
var Q = require('q');
var _ = require('underscore');

var filter = require('util/filter').filter;


var BASE_URL = 'http://ws.spotify.com/';

var SEARCH_URLS = {
    track: BASE_URL + 'search/1/track.json',
    artist: BASE_URL + 'search/1/artist.json',
    album: BASE_URL + 'search/1/album.json'
};

var LOOKUP_URL = BASE_URL + 'lookup/1/.json';


/**
 *
 * @param opts
 * {
 *    type: track | artist | album
 *    query: search
 *    success: function
 *    error: function
 * }
 */
var doSearch = function(opts) {
    // console.log('searching by track');
    var query = opts.query,
        type = opts.type;

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

            filter()
            opts.success({info:info, playlist: formattedTracks});
        });
    })
}

exports.searchByTrack = function(opts) {
    doSearch(_.extend(opts, {type:'track'}));
};

exports.searchByArtist = function(opts) {
    doSearch(_.extend(opts, {type:'artist'}));
};

exports.searchByAlbum = function(opts) {
    doSearch(_.extend(opts, {type:'album'}));
};

/**
 *
 * @param opts
 * {
 *     uri: trackId
 * }
 */
exports.lookup = function(opts) {
    // console.log('searching by track');
    var uri = opts.uri;
    if (!uri) {
        opts.error({errorCode: 'error.spotifyService.lookup.noUri'});
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

            var track = {
                trackId: respObj.track.href,
                name: respObj.track.name,
                artists:_.reduce(respObj.track.artists, function(memo, artist) {
                        if (memo) memo+= ", ";
                        return (memo += artist.name);
                    }, ""),
                album: respObj.track.album.name
            };

            opts.success(track);
        });
    })
};
