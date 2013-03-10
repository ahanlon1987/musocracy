
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
  , votes = require('./routes/votes'
  , location = require('./routes/location')
  , locationService = require('./services/locationService').locationService);



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

app.get('/', routes.index);
app.get('/search/track', search.byTrack);
app.get('/search/artist', search.byArtist);
app.get('/search/album', search.byAlbum);
app.get('/lookup', lookup.lookup);
app.get('/location/:locationId', location.getLocation);
app.get('/location/:locationId/votes', votes.getVotes);
app.get('/location/:locationId/votes/:trackId', votes.addVote);
app.post('/location/:locationId/votes/:trackId', votes.addVote);
app.post('/location/:locationId/track/:trackId', votes.markAsPlayed);
app.get('/location/:locationId/track/:trackId', votes.markAsPlayed);


var config = {};
app.configure('development', function() {
  app.use(express.errorHandler());
  config = require('./config/development.json');
  app.set('port', config.port);
});

app.configure('production', function() {
  config = require('./config/production.json');
  app.set('port', config.port);
});

var dbhost = config.mongo.host,
  dbport = config.mongo.port,
  dbuser = config.mongo.user,
  dbpassword = config.mongo.password;

var mongoClient = new MongoClient(new MongoServer(dbhost, dbport));
mongoClient.open(function(err, mongoClient) {
  if (err) {
    console.log('Failed opening connection to ' + dbhost + ':' + dbport);
    throw err
  };

  var db = mongoClient.db('musocracy');
  if (dbuser && dbpassword) {
    db.authenticate(dbuser, dbpassword, function(err2, data) {
      if (err2) {
        console.log('Error authenticating with user=', dbuser);
        throw err2;
      }
      votingService.setDb(db);
      locationService.setDb(db);

      http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
      });
    });
  }

  else {
    votingService.setDb(db);
      locationService.setDb(db);

      http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
      });
  }
  
});

