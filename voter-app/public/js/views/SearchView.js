// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/SearchModel" ], function( $, Backbone, SearchModel ) {

    // Extends Backbone.View
    var SearchView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Category Models are added to the Collection
            this.collection.on( "reset", this.render, this );

        },

        // Renders all of the Category models on the UI
        render: function() {


            _.each(this.collection.models, function(song){
                if ($.inArray(song.get('href'), this.amplify.store('previousVotes')) >= 0){
                    song.set('disableVote', 'ui-disabled');
                }
            });

            // Sets the view's template property
            this.template = _.template( $( "script#searchResults" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#results").html(this.template);

            var searchView = this;
            //Handles Voting action
            $('ul#results li').click(function(e) {
                var songHref = this.attributes['data-name'];
                if(songHref && songHref.value){
                    var song = searchView.collection.where({href:songHref.value});
                    if(song instanceof Array) {
                        router.persist.vote(song[0]);
                    }
                } else {
                    console.log('unable to determine which song to vote for.');
                }

            });

            // Maintains chainability
            return this;
        }

    } );

    // Returns the View class
    return SearchView;

} );