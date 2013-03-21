var _ = require('underscore');
var PLAYLISTS_COLLECTION = 'playlists';
var MAX_PLAYED_LENGTH = 20;

/*
{
    locationId: "Kincades",
    votes: [
        { name: "Inside Out", artists: "Eve 6", album: "Album Name", votes: 3 },
        ...
    ]
    played: [
        { name: "Californication", artists: "Red Hot Chili Peppers", album: "Album Name", votes: 5, played: true },
        { name: "Can't Stop", artists: "Red Hot Chili Peppers", album: "Album Name", votes: 3, played: true },
    ],
}
 */

var updatePlaylist = function(location) {
    var votes = location.votes;
    var topFive = votes.slice(0, 5);


};

var votingService = {
    setDb:function (db) {
        this.db = db;
    },

    addVote:function (locationId, obj, options) {
        console.log('Adding vote for locationId=' + locationId);

        this.db.collection(PLAYLISTS_COLLECTION, function (err, collection) {
            if (err) {
                console.error('Error fetching collection (name=' + PLAYLISTS_COLLECTION + ')');
                (options && options.error && options.error(err));
                return;
            }

            console.error('found collection; searching for location.');
            collection.findOne({locationId:locationId.toLowerCase()}, function (err, location) {
                if (err) {
                    console.error('Error finding collection.', err);
                    options && options.error && options.error(err);
                    return;
                }

                if (!location) {
                    location = {
                        locationId:locationId.toLowerCase()
                    };
                }
                if (!location.votes) {
                    location.votes = [];
                }
                if (!location.played) {
                    location.played = [];
                }

                console.error('Search tracks for track.trackId=' + obj.trackId);
                var track = _.find(location.votes, function(track) {
                    return track.trackId === obj.trackId;
                });

                if (track) {
                    track.votes++;
                }
                else {
                    location.votes.push({
                        trackId:obj.trackId,
                        name:obj.name,
                        artists:obj.artists,
                        album:obj.album,
                        votes:1
                    });
                }

                location.votes = _.sortBy(location.votes, function (track) {
                    return track.votes * -1;  // inverse sort order
                });

                collection.update({locationId:location.locationId}, location, {upsert:true}, function (err, obj) {
                    if (err) {
                        console.error('Error saving vote.', err);
                        (options && options.error && options.error(err));
                    }
                    else {
                        (options && options.success && options.success(location));
                    }
                });
            });
            // collection.findAndModify({locationId:locationId }, [['trackName',1]],
            //   {$inc: {voteCount: 1}}, {upsert:true}, function(err, doc) {
            //     if (err) {
            //       console.log('error adding vote for locationId ' + locationId, err);
            //       if (options && options.error) options.error(err);
            //     }
            //     else {
            //       if (options && options.success) options.success(doc);
            //     }
            //   });

        });
    },

    getVotes:function (obj, options) {
        var locationId = obj.locationId;
        var limit = obj.limit || 0;
        var excludePlayed = obj.excludePlayed || false;
        this.db.collection(PLAYLISTS_COLLECTION, function (err, collection) {
            if (err) {
                console.error('Error fetching collection (name=' + PLAYLISTS_COLLECTION + ')');
                (options && options.error && options.error(err));
                return;
            }

            if (!collection) {
                (options && options.success && options.success(collection));
                return;
            }

            collection.findOne({locationId:locationId}, function (err, location) {
                if (err) {
                    console.log('error fetching location', err);
                    if (options && options.error) {
                        options.error(err);
                    }
                }
                else {
                    //TODO throw an error if the location doesn't exist?
                    if (!location) {
                        location = {
                            locationId:locationId,
                            votes:[],
                            played:[]
                        };
                    }

                    if (excludePlayed) {
                        location.votes = _.filter(location.votes, function (track) {
                            return !track.played;
                        });
                    }

                    if (limit && limit > 0) {
                        location.votes = location.votes.slice(0, limit);
                    }
                    if (options && options.success) {
                        options.success(location);
                    }
                }
            });
        })
    },

    markAsPlayed:function (obj, options) {
        var self = this;
        this.db.collection(PLAYLISTS_COLLECTION, function (err, collection) {
            if (err) {
                console.error('Error fetching collection (name=' + PLAYLISTS_COLLECTION + ')');
                (options && options.error && options.error(err));
                return;
            }

            console.log('Receving mark as played request: ' + JSON.stringify(obj));
            collection.findOne({locationId:obj.locationId}, function (err, location) {
                if (err) {
                    console.error('Error finding collection.', err);
                    options && options.error && options.error(err);
                    return;
                }

                if (!location) {
                    location = {
                        locationId:obj.locationId
                    };
                }
                if (!location.played) {
                    location.played = [];
                }
                if (!location.votes) {
                    location.votes = [];
                }

                var trackIndex = -1;
                var track = _.find(location.votes, function (track, i) {
                    if (track.trackId == obj.trackId && !track.played) {
                        trackIndex = i;
                        return true;
                    }
                    else {
                        return false;
                    }
                });



                if (track) {
                    console.log('Found track: ' + JSON.stringify(track));
                    track.played = true;
                    location.votes.splice(trackIndex, 1);
                }
                else {
                    track = {
                        trackId:obj.trackId,
                        played:true
                    };
                }

                console.log('pushing track onto played list: ' + JSON.stringify(track));
                location.played.push(track);
                while (location.played > MAX_PLAYED_LENGTH) {
                    location.played.unshift();
                }


                var topTrack = _.sortBy(location.votes, function (track) {
                    return track.votes * -1;
                })[0];

                location.upNext = topTrack;

                collection.update({locationId:location.locationId}, location, {upsert:true}, function (err, obj) {
                    if (err) {
                        console.error('Error marking track as played.', err);
                        (options && options.error && options.error(err));
                    }
                    else {
                        self.getVotes({
                            locationId:location.locationId,
                            limit:5,
                            excludePlayed:true
                        }, options);
                        // (options && options.success && options.success(location));
                    }
                })
            });
        })
    }
}

exports.votingService = votingService;



