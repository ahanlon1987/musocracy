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

            // Sets the view's template property
            this.template = _.template( $( "script#searchResults" ).html(), { "collection": this.collection } );

            // Renders the view's template inside of the current listview element
            this.$el.find("ul#search-results").html(this.template);

            // Maintains chainability
            return this;
        }

    } );

    // Returns the View class
    return SearchView;

} );