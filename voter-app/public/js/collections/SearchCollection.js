// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/SearchModel" ], function( $, Backbone, SearchModel) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

            // Sets the type instance property (ie. animals)
            this.type = options.type;

        },

        // Sets the Collection model property to be a Search Model
        model: SearchModel,

        url:'http://ws.spotify.com/search/1/track.json?q=',

        // Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
        sync: function( method, model, options ) {

            // Instantiates an empty array
            var searchResults = [],

                // Stores the this context in the self variable
                self = this,

                // Creates a jQuery Deferred Object
                deferred = $.Deferred();

            // Uses a setTimeout to mimic a real world application that retrieves data asynchronously
            setTimeout( function() {

                //TODO they were filtering, we don't need to.

                // Calls the options.success method and passes an array of objects (Internally saves these objects as models to the current collection)
                options.success( searchResults );

                // Triggers the custom `added` method (which the Category View listens for)
                self.trigger( "added" );

                // Resolves the deferred object (this triggers the changePage method inside of the Category Router)
                deferred.resolve();

            }, 1000);

            // Returns the deferred object
            return deferred;

        }

    } );

    // Returns the Model class
    return Collection;

} );