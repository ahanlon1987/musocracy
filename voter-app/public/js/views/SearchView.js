// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/SearchModel" ], function( $, Backbone, SearchModel ) {


    var THREE_HOURS_IN_MS = 10800000;

    // Extends Backbone.View
    var SearchView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Category Models are added to the Collection
            this.collection.on( "reset", this.render, this );

        },

        // Renders all of the Category models on the UI
        render: function() {


            //TODO this logic is doubled in QueueView, also this logic blows. Think of more clever way to do this.
            _.each(this.collection.models, function(song){
                var index = $.inArray(song.get('trackId'), _.pluck(this.amplify.store('previousVotes'), 'trackId'));
                if (index >= 0){
                    var oldVote = this.amplify.store('previousVotes')[index];
                    if(oldVote){
                        if((new Date()) - (new Date(oldVote.voteTime)) < THREE_HOURS_IN_MS){
                            song.set('disableVote', 'ui-disabled');
                        }
                    }
                }
            });

            // Sets the view's template property
            this.template = _.template( $( "script#searchResults" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#search-results").html(this.template);

            var searchView = this;
            //Handles Voting action
            //touchstarts suck in the browser.
//            $('span.add-action').touchstart(function(e) {
            //TODO this logic is doubled in QueueView
            $('span.add-action').click(function(e) {
                var songHref = this.attributes['data-name'];
                if(songHref && songHref.value){

                    var current = $(e.currentTarget);
                    if( current ) {
                        //TODO some sort of animation to inform user action was received.
                        current.find('span.ui-icon') ?  current.find('span.ui-icon').addClass('active-click'): void 0;
                    }
                    var song = searchView.collection.where({trackId:songHref.value});
                    if(song instanceof Array && song != null) {
                        router.persist.vote(song[0], function(){
                            searchView.collection.fetch();
                        });
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
    return SearchView;

} );