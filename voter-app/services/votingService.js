
var _ = require('underscore');
var PLAYLISTS_COLLECTION = 'playlists';

var votingService = {
  setDb:function(db) {
    this.db = db;
  },

  addVote:function(locationId, obj, options) {
    console.log('Adding vote for locationId=' + locationId);

    this.db.collection(PLAYLISTS_COLLECTION, function(err, collection) {
      if (err) {
        console.log('Error fetching collection (name=' + PLAYLISTS_COLLECTION + ')');
        (options && options.error && options.error(err));
        return;
      }

      console.log('found collection; searching for location.');
      collection.findOne({locationId:locationId}, function(err, location) {
        if (err) {
          console.log('Error finding collection.', err);
          options && options.error && options.error(err);
          return;
        }

        if (!location) {
          location = {
            locationId: locationId,
          };
        }
        if (!location.playlist) {
          location.playlist = [];
        }
        var exists = false;
        console.log('Search tracks for track.id=' + obj.trackId);
        location.playlist.forEach(function(track) {
          if (track.trackId == obj.trackId) {
            track.votes++;
            exists = true;
          }
        });

        if (!exists) {
          location.playlist.push({
            trackId: obj.trackId,
            name: obj.name,
            artists:obj.artists,
            album:obj.album,
            votes: 1
          });
        }

        collection.update({locationId: location.locationId}, location, {upsert:true}, function(err, obj) {
          if (err) {
            console.log('Error saving vote.', err);
            (options && options.error && options.error(err));
          }
          else {
            (options && options.success && options.success(location));
          }
        })
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

  getVotes:function(obj, options) {
    var locationId = obj.locationId;
    var limit = obj.limit || 0;
    var excludePlayed = obj.excludePlayed || false;
    this.db.collection(PLAYLISTS_COLLECTION, function(err, collection) {
      if (err) {
        console.log('Error fetching collection (name=' + PLAYLISTS_COLLECTION  + ')');
        (options && options.error && options.error(err));
        return;
      }

      if (!collection) {
        (options && options.success && options.success(collection));
        return;
      }

      collection.findOne({locationId: locationId}, function(err, location) {
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
              playlist: []
            };
          }
          location.playlist = _.sortBy(location.playlist, function(track) {
              return track.votes * -1;  // inverse sort order
            });

          if (excludePlayed) {
            location.playlist = _.filter(location.playlist, function(track) {
              return !track.played;
            })
          }

          if (limit && limit > 0) {
            location.playlist = location.playlist.slice(0, limit);
          }
          if (options && options.success) {
            options.success(location);
          }
        }
      });
    })
  },

  markAsPlayed:function(obj, options) {
    var self = this;
    this.db.collection(PLAYLISTS_COLLECTION, function(err, collection) {
      if (err) {
        console.log('Error fetching collection (name=' + PLAYLISTS_COLLECTION  + ')');
        (options && options.error && options.error(err));
        return;
      }

      collection.findOne({locationId:obj.locationId}, function(err, location) {
        if (err) {
          console.log('Error finding collection.', err);
          options && options.error && options.error(err);
          return;
        }

        if (!location) {
          location = {
            locationId: locationId,
          };
        }
        if (!location.playlist) {
          location.playlist = [];
        }

        var track = _.find(location.playlist, function(track) {
          return track.trackId == obj.trackId;
        });

        if (!track) {
          track = {
            trackId:obj.trackId,
            played:true
          };
        }

        track.played = true;

        collection.update({locationId: location.locationId}, location, {upsert:true}, function(err, obj) {
          if (err) {
            console.log('Error saving vote.', err);
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



