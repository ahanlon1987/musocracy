
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
            artist:obj.artist,
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

  getVotes:function(locationId, options) {
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
          if (options && options.success) {
            options.success(location);
          }
        }
      });
    })
  }
}

exports.votingService = votingService;



