// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/QueueModel"], function( $, Backbone, QueueModel) {

    // Extends Backbone.Collection
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

        },

        // Sets the Collection model property to be a Category Model
        model: QueueModel,

        parse: function(response) {
            if(response){
                return response.playlist;
            }
        }

    } );

    // Returns the Collection class
    return Collection;

} );