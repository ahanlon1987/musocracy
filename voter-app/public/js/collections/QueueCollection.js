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

        jsonArray: [

            { "votes":"11", "name": "Juicy", "href" : "spotify:track:5ByAIlEEnxYdvpnezg7HTX"},
            { "votes":"5", "name": "Ready To Die The Remaster", "href":"spotify:track:2g8HN35AnVGIk7B8yMucww" },
            { "votes":"4", "name": "Hypnotize - Amended Version", "href": "spotify:track:1oLIBuedMjAbHlO4WTGJi3" }
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

            }, 750);

            // Returns the deferred object
            return deferred;

        }

    } );

    // Returns the Model class
    return Collection;

} );