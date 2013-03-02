


var votingService = {
  setDb:function(db) {
    this.db = db;
  },

  addVote:function(locationId, obj, options) {
    console.log('Adding vote for locationId=' + locationId);
    
    this.db.collection(locationId, function(err, collection) {
      if (err) {
        console.log('Error fetching collection (name=' + locationId + ')');
        (options && options.error && options.error(err));
        return;
      }
      collection.findAndModify({trackId:obj.trackId}, [['trackName',1]], 
        {$inc: {voteCount: 1}}, {upsert:true}, function(err, doc) {
          if (err) {
            console.log('error adding vote for locationId ' + locationId, err);
            if (options && options.error) options.error(err);
          }
          else {
            if (options && options.success) options.success(doc);
          }
        });

    });
  },

  getVotes:function(locationId, options) {
    this.db.collection(locationId, function(err, collection) {
      if (err) {
        console.log('Error fetching collection (name=' + locationId + ')');
        (options && options.error && options.error(err));
        return;
      }
      
      if (!collection) {
        (options && options.success && options.success(collection));
        return;
      }

      collection.find().toArray(function(err, items) {
        if (err) {
          console.log('error fetching items', err);
          if (options && options.error) {
            options.error(err);
          }
        }
        else {
          if (options && options.success) {
            options.success(items);
          }
        }
      });
    })
  }
}

exports.votingService = votingService;



