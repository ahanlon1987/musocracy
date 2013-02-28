
var votingService = require('../services/votingService').votingService;

exports.addVote = function(req, resp) {

    var args = req.url.match(req.route.regexp);

    if(args instanceof Array) {
        var locationId = args[1],
            trackId = args[2];

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
    }
};

exports.getVotes = function(req, resp) {

    var args = req.url.match(req.route.regexp);
    if(args instanceof Array) {
        var locationId = args[1];

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
    }
};

// exports.addVote = addVote;
// exports.getVotes = getVotes;