define(['underscore', 'backbone'],
    function (_, Backbone) {
        return _.extend({}, Backbone.Events, {
            events:{
                SEARCH:'SEARCH',
                CLEAR_SEARCH:'CLEAR_SEARCH',
                REFRESH: 'REFRESH',
                LOCATION_UPDATED: 'LOCATION_UPDATED'
            }
        });
    });