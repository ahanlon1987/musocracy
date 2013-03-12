// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/SearchModel","views/ListItemView" ], function( $, Backbone, SearchModel, ListItemView ) {

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

            $("#song-search").removeClass('hidden');

            // Renders the view's template inside of the current listview element
            this.$("ul#results").empty();
            this.collection.each(function(model){
                var listItemView = new ListItemView();
                this.$("ul#results").append(listItemView.render(model).$el);
            });

            var searchView = this;

            // Maintains chainability
            return this;
        }
    } );

    // Returns the View class
    return SearchView;

} );