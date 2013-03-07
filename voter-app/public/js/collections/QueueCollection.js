// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/QueueModel"], function( $, Backbone, QueueModel) {

    // Extends Backbone.Collection
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function() {
        },

        // Sets the Collection model property to be a Category Model
        model: QueueModel,

        comparator:function(model){
            return -model.get('votes');
        },

        parse: function(response) {
            if(response){
                return response.playlist;
            }
        }

    } );

    // Returns the Collection class
    return Collection;

} );