
var votingService = require('../services/votingService').votingService;

exports.addVote = function(req, resp) {

        var locationId = req.params.locationId;
        var trackId = req.params.trackId;
        var track = req.body;

        votingService.addVote(locationId, track, {
            success:function(result) {
                console.log('successfully added vote');
                resp.writeHead(200, {'Content-Type':'application/json'});
                resp.write(JSON.stringify(result));
                resp.end();
            },
            error:function(err) {
                resp.writeHead(500);
                resp.write('Error adding vote');
                resp.end();
            }
        })
    // }
};

exports.getVotes = function(req, resp) {
    var locationId = req.params.locationId;
    var limit = req.query.limit || 0;
    var excludePlayed = (req.query.excludePlayed && (req.query.excludePlayed.toLowerCase() === 'true')) || false;
    votingService.getVotes({
        locationId: locationId,
        limit: limit,
        excludePlayed:excludePlayed
    }, 
    {
        success:function(results) {
            resp.writeHead(200, {'Content-Type':'application/json'});
            resp.write(JSON.stringify(results));
            resp.end();
        },
        error:function(err) {
            resp.writeHead(500);
            resp.write('Error getting votes');
            resp.end();
        }
    })
};

exports.markAsPlayed = function (req, resp) {
  var locationId = req.params.locationId,
    trackId = req.params.trackId;

    console.log('Marking track as played: locationId=' + locationId);
    console.log('trackId=' + trackId);

  votingService.markAsPlayed({
      locationId:locationId,
      trackId:trackId
    }, 
    {
      success:function(result) {
        console.log('successfully added vote');
        resp.writeHead(200, {'Content-Type':'application/json'});
        resp.write(JSON.stringify(result));
        resp.end();
      },
      error:function(err) {
        resp.writeHead(500);
        resp.write('Error adding vote');
        resp.end();
      }
  });
};

// exports.addVote = addVote;
// exports.getVotes = getVotes;