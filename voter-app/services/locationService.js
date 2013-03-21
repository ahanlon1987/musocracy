
var _ = require('underscore');
var PLAYLISTS_COLLECTION = 'playlists';

var locationService = {
    setDb:function(db) {
        this.db = db;
    },

    //TODO we could probably use to increment a user count or something
    findLocation:function(locationId, options) {
        console.log('Adding vote for locationId=' + locationId);

        this.db.collection(PLAYLISTS_COLLECTION, function(err, collection) {
            if (err) {
                console.log('Error fetching collection (name=' + PLAYLISTS_COLLECTION + ')');
                (options && options.error && options.error(err));
                return;
            }

            console.log('found collection; searching for location.');

            collection.findOne({locationId:locationId.toLowerCase()}, function(err, location) {
                if (err) {
                    console.log('Error finding collection.', err);
                    options && options.error && options.error(err);
                    return;
                }

                if (!location) {
                    console.log('Unable to find location. Returning null');
                    options && options.success && options.success(null)
                } else {
                    console.log('Found location ' + locationId + '. Returning location');
//                    options && options.success && options.success({"locationId":locationId})
                    options && options.success && options.success(location);
                }
            });
        });
    }
};

exports.locationService = locationService;



