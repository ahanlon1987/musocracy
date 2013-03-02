// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify", "models/QueueModel" ], function( $, Backbone, Amplify, QueueModel) {

    // Extends Backbone.View
    var QueueView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Song Models are added to the Collection
            this.collection.on( "reset", this.render, this );

        },

        amplify:Amplify,

        // Renders all of the Category models on the UI
        render: function() {

            _.each(this.collection.models, function(model){
                if ($.inArray(model.get('trackId'), this.amplify.store('previousVotes')) >= 0){
                      model.set('disableVote', 'ui-disabled');
                }
            });

            //Order by vote count
            this.collection.comparator = function (song) {
              return -song.get("voteCount");
            };
            this.collection.sort({silent: true});

            // Sets the view's template property
            this.template = _.template( $( "script#queuedItems" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#results").html(this.template);

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return QueueView;

} );