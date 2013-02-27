// Category Collection
// ===================

// Includes file dependencies
define([ "jquery","backbone","models/QueueModel" ], function( $, Backbone, QueueModel ) {

    // Extends Backbone.Router
    var Collection = Backbone.Collection.extend( {

        // The Collection constructor
        initialize: function( models, options ) {

            // Sets the type instance property (ie. animals)
            this.type = options.type;

        },

        // Sets the Collection model property to be a Category Model
        model: QueueModel,

        //TODO what does the fetch look like
        jsonArray: [

            { "name": "Call me, Maybe", "type": "blah blah" },
            { "name": "Naughty By Nature", "type": "blah3 blah3" },
            { "name": "Single Ladies", "type": "blah2 blah2" }

        ],


        // Overriding the Backbone.sync method (the Backbone.fetch method calls the sync method when trying to fetch data)
        sync: function( method, model, options ) {

            // Local Variables
            // ===============

            // Instantiates an empty array
            var songs= [],

                // Stores the this context in the self variable
                self = this,

                // Creates a jQuery Deferred Object
                deferred = $.Deferred();

            // Uses a setTimeout to mimic a real world application that retrieves data asynchronously
            setTimeout( function() {

                // Filters the above sample JSON data to return an array of only the correct category type
//                songs = _.filter( self.jsonArray, function( row ) {
//                    return row.category === self.type;
//                } );

                songs = self.jsonArray;


                // Calls the options.success method and passes an array of objects (Internally saves these objects as models to the current collection)
                options.success( songs );

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