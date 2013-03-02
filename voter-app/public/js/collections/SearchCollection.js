// Search Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/SearchModel"], function( $, Backbone, SearchModel) {

    // Extends Backbone.Collection
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

        },


        // Sets the Collection model property to be a Search Model
        model: SearchModel,

        parse: function(response){

            return response.playlist;

        }
    } );

    // Returns the Collection class
    return Collection;

} );