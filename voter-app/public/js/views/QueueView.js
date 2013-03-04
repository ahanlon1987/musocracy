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

            // Sets the view's template property
            this.template = _.template( $( "script#queuedItems" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#results").html(this.template);

            var queueView = this;

            //Handles Voting action
            $('ul#results li').click(function(e) {
                var songHref = this.attributes['data-name'];
                if(songHref && songHref.value){
                    var song = queueView.collection.where({trackId:songHref.value});
                    if(song instanceof Array){
                        router.persist.vote(song[0]);
                    }
                } else {
                    console.log('unable to determine which song to vote for');
                }
            });

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return QueueView;

} );