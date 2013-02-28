// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","models/QueueModel" ], function( $, Backbone, QueueModel ) {

    // Extends Backbone.View
    var QueueView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Song Models are added to the Collection
            this.collection.on( "added", this.render, this );

        },

        // Renders all of the Category models on the UI
        render: function() {

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