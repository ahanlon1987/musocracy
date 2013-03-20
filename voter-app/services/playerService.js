var _ = require('underscore');
var spotifyService = require('../services/spotifyService');
var votingService = require('../services/votingService').votingService;

var PLAYLISTS_COLLECTION = 'playlists';
var MAX_PLAYED_LENGTH = 20;

/**
 *
 * @param opts
 * {
 *    trackId: track ID to load
 *    success: function
 *    error: function
 * }
 */
var deferTrackLoad = function(opts) {
    var trackId = opts.trackId;

    spotifyService.lookup({
        uri: trackId,
        success: opts.success,
        error: opts.error
    });
}


var service = {

    setDb:function(db) {
        this.db = db;
    },

    /**
     *
     * @param opts
     * {
     *     locationId: locationId
     *     nowPlaying: trackId
     *     upNext: trackId
     *     success: function
     *     error: function
     * }
     */
    updateNowPlayingAndQueueNext:function(options) {
        var locationId = options.locationId;
        var nowPlayingTrackId = options.nowPlaying;
        var upNextTrackId = options.upNext;
        if (!locationId) {
            throw new Error("locationId param is required");
        }

        var self = this;
        this.db.collection(PLAYLISTS_COLLECTION, function (err, collection) {
            if (err) {
                console.error('Error retrieving collection.');
                if (options && _.isFunction(options.error)) options.error(err);
                else throw err;
            }

            collection.findOne({locationId: locationId}, function(err, location) {
                if (err) {
                    console.error('Error finding collection.', err);
                    if (options && _.isFunction(options.error)) options.error(err);
                    else throw err;
                }

                if (!location) {
                    location = {
                        locationId: locationId
                    };
                }

                if (!location.votes) {
                    location.votes = [];
                }

                if (!location.played) {
                    location.played = [];
                }

                var nowPlaying, upNext,
                    nowPlayingIndex = -1,
                    upNextIndex = -1;

                if (nowPlayingTrackId) {
                    if (location.upNext && location.upNext.trackId === nowPlayingTrackId) {
                        nowPlaying = location.upNext;
                    }
                    else {
                        nowPlaying = _.find(location.votes, function(track, index) {
                            if (track.trackId === nowPlayingTrackId) {
                                nowPlayingIndex = index;
                                return true;
                            }
                            return false;
                        });
                        if (nowPlaying) {
                            location.votes.splice(nowPlayingIndex, 1);
                        }
                    }

                    // if nowPlaying was found, store it and remove from the votes list
                    if (nowPlaying) {
                        location.nowPlaying = nowPlaying;
                        location.played.push(nowPlaying);
                    }
                    else {
                        deferTrackLoad({
                            trackId: nowPlayingTrackId,
                            success: function(track) {
                                collection.update({locationId:location.locationId}, {$set: {nowPlaying:track}});
                            },
                            error: function(err) {
                                console.error('Error deferring load of up next track', err);
                            }
                        })
                    }
                }
                else {
                    location.nowPlaying = null;
                }

                if (upNextTrackId) {
                    upNext = _.find(location.votes, function(track, index) {
                        if (track.trackId === upNextTrackId) {
                            upNextIndex = index;
                            return true;
                        }
                        return false;
                    });

                    // if upNext was found, store it and remove from the votes list
                    if (upNext) {
                        location.upNext = upNext;
                        location.votes.splice(upNextIndex, 1);
                    }
                    else {
                        deferTrackLoad({
                            trackId: upNextTrackId,
                            success: function(track) {
                                collection.update({locationId:location.locationId}, {$set: {upNext:track}});
                            },
                            error: function(err) {
                                console.error('Error deferring load of up next track', err);
                            }
                        })
                    }
                }
                else {
                    location.upNext = null;
                }

                collection.update({locationId:location.locationId}, location, {upsert:true}, function (err, obj) {
                    if (err) {
                        console.error('Error marking track as played.', err);
                        (options && options.error && options.error(err));
                    }
                    else {
                        votingService.getVotes({
                            locationId:location.locationId,
                            limit:5,
                            excludePlayed:true
                        }, options);
                        // (options && options.success && options.success(location));
                    }
                });

            });
        })

    }


};

exports.api = service;