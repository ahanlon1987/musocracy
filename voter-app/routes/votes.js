
var votingService = require('../services/votingService').votingService; 

exports.addVote = function(req, resp) {
  var locationId = req.query.locationId, 
    trackId = req.query.trackId;
  votingService.addVote(locationId, {trackId: trackId}, {
    success:function(result) {
      console.log('successfully added vote');
      resp.writeHead(200, {'Content-Type':'application/json'});
      resp.write(JSON.stringify(result));
      resp.end();
    },
    error:function(err) {
      resp.writeHead(500);
      resp.write(err);
      resp.end();
    }
  })
};

exports.getVotes = function(req, resp) {
  var locationId = req.query.locationId;
  votingService.getVotes(locationId, {
    success:function(results) {
      resp.writeHead(200, {'Content-Type':'application/json'});
      resp.write(JSON.stringify(results));
      resp.end();
    },
    error:function(err) {
      resp.writeHead(500);
      resp.write(err);
      resp.end();
    }
  })
};

// exports.addVote = addVote;
// exports.getVotes = getVotes;