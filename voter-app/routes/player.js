
var playerService = require('../services/playerService').api;

exports.updateNowPlayingAndQueueNext = function (req, resp) {
    var locationId = req.params.locationId;
    var nowPlaying = req.query.nowPlaying;
    var upNext = req.query.upNext;


    console.log('Marking track as played: locationId=' + locationId);
    console.log('nowPlaying=' + nowPlaying);
    console.log('upNext=' + upNext);

    playerService.updateNowPlayingAndQueueNext({
            locationId:locationId,
            nowPlaying:nowPlaying,
            upNext:upNext,
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