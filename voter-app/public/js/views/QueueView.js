// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify", "models/QueueModel", "views/ListItemView" ], function( $, Backbone, Amplify, QueueModel, ListItemView) {

    // Extends Backbone.View
    var THREE_HOURS_IN_MS = 10800000;

    var QueueView = Backbone.View.extend({

        // The View Constructor
        initialize: function() {

            // The render method is called when Song Models are added to the Collection
            this.collection.on( "reset", this.render, this );

        },

        amplify:Amplify,

        // Renders all of the Category models on the UI
        render: function() {

            $("#song-search").addClass('hidden');

            // Renders the view's template inside of the current listview element
            this.$("ul#results").empty();
            this.collection.each(function(model){
                var listItemView = new ListItemView();
                this.$("ul#results").append(listItemView.render(model).$el);
            });

            var queueView = this;

            // Maintains chainability
            return this;
        }

    } );

    return QueueView;


} );