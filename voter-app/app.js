
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , search = require('./routes/search')
  , lookup = require('./routes/lookup')
  , http = require('http')
  , path = require('path')
  , MongoClient = require('mongodb').MongoClient
  , MongoServer = require('mongodb').Server 
  , votingService = require('./services/votingService').votingService
  , votes = require('./routes/votes');



var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
  app.use(express.static(path.join(__dirname, 'views')));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/search/track', search.byTrack);
app.get('/search/artist', search.byArtist);
app.get('/search/album', search.byAlbum);
app.get('/lookup', lookup.lookup);
app.get('/location/:locationId/votes', votes.getVotes);
app.get('/location/:locationId/votes/:trackId', votes.addVote);
app.post('/location/:locationId/votes/:trackId', votes.addVote);


var mongoClient = new MongoClient(new MongoServer('127.0.0.1', 27017));
mongoClient.open(function(err, mongoClient) {
  if (err) throw err;

  var db = mongoClient.db('musocracy');
  votingService.setDb(db);
  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});

// var MONGO_URL = 'mongo://127.0.0.1:27017/musocracy';
// MongoClient.connect(MONGO_URL, function(err, db) {
//   if (err) throw err;

//   votingService.setDb(db);
//   http.createServer(app).listen(app.get('port'), function(){
//     console.log("Express server listening on port " + app.get('port'));
//   });
// });
