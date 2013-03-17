// Category Collection
// ===================

// Includes file dependencies
define([ "jquery", "backbone", "models/QueueModel"], function ($, Backbone, QueueModel) {

    // Extends Backbone.Collection
    var Collection = Backbone.Collection.extend({

        // The Collection constructor
        initialize:function () {
        },

        isEmpty:function () {
            return (this.models.length < 1);
        },

        type:'Queue',

        // Sets the Collection model property to be a Category Model
        model:QueueModel,

        comparator:function (model) {
            return -model.get('votes');
        },

        parse:function (response) {
            if (response) {
                return response.playlist;
            }
        },

        getFilteredResults:function (filter) {
            return _.filter(this.models, function (model) {
                //TODO make this better e.g., to lowercase on everything.
                return model.get('name') == filter;
            });
        }

    });

    // Returns the Collection class
    return Collection;

});