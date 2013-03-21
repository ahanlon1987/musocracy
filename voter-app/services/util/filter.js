var locationService = require('../locationService').locationService;
var _ = require('underscore');

/**
 *
 * @param opts
 */
exports.filter = function(opts) {
    var locationId = opts.locationId;
    var results = opts.results;
    var fnSuccess = opts.success;
    var fnError = opts.error;

    locationService.findLocation(locationId, {
        success:function(location) {
            var votes = location.votes;
            var votesByTrackId = _.reduce(votes, function(memo, vote) {
                memo[vote.trackId] = vote;
                return memo;
            }, {});

            var filteredResults = _.filter(results, function(result) {
                if (votesByTrackId[result.trackId]) {
                    return false;
                }
                return true;
            });

            fnSuccess(filteredResults);
        },
        error:fnError
    });
};

