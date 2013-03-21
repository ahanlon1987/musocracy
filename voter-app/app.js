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
    , votingService = require('./services/votingService').votingService
    , votes = require('./routes/votes')
    , location = require('./routes/location')
    , player = require('./routes/player')
    , locationService = require('./services/locationService').locationService
    , playerService = require('./services/playerService').api;


var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    // app.set('views', __dirname + '/views');
    // app.set('view engine', 'jade');
    app.use(express.static(path.join(__dirname, 'views')));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('less-middleware')({
//      src: __dirname + '/public',
        dest:__dirname + '/public/css',
        src:__dirname + '/public/less',
        prefix:'/css'
    }));

});

app.get('/', routes.index);
app.get('/location/:locationId/search/track', search.byTrack);
app.get('/location/:locationId/search/artist', search.byArtist);
app.get('/location/:locationId/search/album', search.byAlbum);
app.get('/lookup', lookup.lookup);
app.get('/location/:locationId', location.getLocation);
app.get('/location/:locationId/votes', votes.getVotes);
app.get('/location/:locationId/votes/:trackId', votes.addVote);
app.post('/location/:locationId/votes/:trackId', votes.addVote);
app.post('/location/:locationId/track/:trackId', votes.markAsPlayed);
app.get('/location/:locationId/track/:trackId', votes.markAsPlayed);
app.get('/location/:locationId/updateQueue', player.updateNowPlayingAndQueueNext);


var config = {};
var mongourl;

var generate_mongo_url = function (obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if (obj.username && obj.password) {
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else {
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}


app.configure('development', function () {
    console.log('Loading development configuration');

    app.use(express.errorHandler());
    app.use(express.static(path.join(__dirname, 'public')));
    config = require('./config/development.json');
    app.set('port', config.port);
    mongourl = generate_mongo_url(config.mongo);
});

app.configure('production', function () {
//mongodb://af_musocracy-musocracyapp:l4gr81b7468j1pkvpu17mmtp50@dbh42.mongolab.com:27427/af_musocracy-musocracyapp  

    console.log('Loading production configuration');

    app.use(express.static(path.join(__dirname, 'public-built')));

    config = require('./config/production.json');
//    app.set('port', process.env.VCAP_APP_PORT || 3000);
    mongourl = "mongodb://musocracy:slalom123@dbh44.mongolab.com:27447/musocracy";
});

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));

    config = require('./config/production.json');
//    app.set('port', process.env.VCAP_APP_PORT || 3000);
    mongourl = "mongodb://musocracy:slalom123@dbh44.mongolab.com:27447/musocracy";
});

if (!mongourl) {
    console.log("Couldn't find mongolab URI! Exiting now");
    throw new Error('MONGOLAB_URI environment variable not found.');
}

console.log('Mongolab URI: ' + mongourl);

console.error("About to connect to " + mongourl);
require('mongodb').connect(mongourl, function (err, conn) {
    if (err) {
        console.log('Error connecting to Mongo', err);
        throw err;
    }

    console.log('Mongo connection obtained.');
    votingService.setDb(conn);
    locationService.setDb(conn);
    playerService.setDb(conn);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });

});

