// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify", "models/QueueModel" ], function( $, Backbone, Amplify, QueueModel) {

    // Extends Backbone.View
    var THREE_HOURS_IN_MS = 10800000;

    var QueueView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Song Models are added to the Collection
            this.collection.on( "reset", this.render, this );

        },

        amplify:Amplify,

        // Renders all of the Category models on the UI
        render: function() {

            //TODO this logic is doubled in SearchView, also this logic blows. Think of more clever way to do this.
            // Also get this shit outta the view
            _.each(this.collection.models, function(model){
                var index = $.inArray(model.get('trackId'), _.pluck(this.amplify.store('previousVotes'), 'trackId'));
                if (index >= 0){
                    var oldVote = this.amplify.store('previousVotes')[index];
                    if(oldVote){
                        if((new Date()) - (new Date(oldVote.voteTime)) < THREE_HOURS_IN_MS){
                            model.set('disableVote', 'ui-disabled');
                        }
                    }
                }
            });

            // Sets the view's template property
            this.template = _.template( $( "script#queuedItems" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#queue-results").html(this.template);

            var queueView = this;

            //Handles Voting action
            //touchstarts suck in the browser.
//            $('span.vote-action').touchstart(function(e) {
            $('span.vote-action').click(function(e) {
                var songHref = this.attributes['data-name'];
                if(songHref && songHref.value){
                    var song = queueView.collection.where({trackId:songHref.value});
                    if(song instanceof Array){
                        //persist the vote
                        router.persist.vote(song[0]);
                        //Manually add it in the collection, and sort it.
                        var curVotes = queueView.collection._byCid[song[0].cid].get('votes');
                        queueView.collection._byCid[song[0].cid].set('votes', (curVotes +1));
                        queueView.collection.sort();

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