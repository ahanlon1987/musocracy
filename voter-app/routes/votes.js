
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
    votingService.getVotes(locationId, {
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

// exports.addVote = addVote;
// exports.getVotes = getVotes;