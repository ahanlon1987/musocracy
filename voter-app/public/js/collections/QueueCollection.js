// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/QueueModel" ], function( $, Backbone, QueueModel ) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

            // Sets the type instance property (ie. Queue)
            this.type = options.type;

        },

        // Sets the Collection model property to be a Category Model
        model: QueueModel,

        parse: function(response) {
            console.log('inside QueueCollection#parse');

            this.add(response);

            return response;

        }

    } );

    // Returns the Model class
    return Collection;

} );