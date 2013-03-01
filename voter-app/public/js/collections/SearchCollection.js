// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/SearchModel"], function( $, Backbone, SearchModel) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

            // Sets the type instance property (ie. animals)
            this.type = options.type;

        },

        //TODO Should probably sort sever side.
        comparator:function(model){
          return model.get('voteCount');
        },

        // Sets the Collection model property to be a Search Model
        model: SearchModel,

        parse: function(response){

            return response.tracks;

        }
    } );

    // Returns the Model class
    return Collection;

} );