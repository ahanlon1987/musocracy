// Mobile Router
// =============

// Includes file dependencies
define([ "jquery","backbone", "../collections/SearchCollection", "../collections/QueueCollection", "../views/SearchView", "../views/QueueView"],
function( $, Backbone, SearchCollection, QueueCollection, SearchView, QueueView) {

    // Extends Backbone.Router
    var MusocracyRouter = Backbone.Router.extend( {

        // The Router constructor
        initialize: function() {

            // Instantiates a new Search  View
            this.searchView = new SearchView( { el: "#search", collection: new SearchCollection ( [] , { type: "search" } ) } );

            // Instantiates a new Queue View
            this.queueView= new QueueView( { el: "#queue", collection: new QueueCollection( [] , { type: "queue" } ) } );

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {

            // When there is no hash bang on the url, the home method is called
            "": "home",

            //#queue, show the current queue
            "queue" : "queue",

            //#search, show the search view
            "search?:query" : "search"

        },

        // Home method
        home: function() {
            // Programatically changes to the queue page
            $.mobile.changePage( "#queue" , { reverse: false, changeHash: false } );

        },

        queue: function() {
            var currentView = this.queueView;

            //TODO always refresh? probably...
            if(!currentView.collection.length) {

                // Show's the jQuery Mobile loading icon
                $.mobile.loading( "show" );

                // Fetches the Collection of Queue Models for the current Queue View
                currentView.collection.fetch().done( function() {

                    // Programatically changes to the current categories page
                    $.mobile.changePage( "#queue", { reverse: false, changeHash: false } );

                } );

            }
            // If there already collections in the current Queue View
            else {

                // Programatically changes to the current categories page
                $.mobile.changePage( "#queue", { reverse: false, changeHash: false } );

            }

        },

        search: function(query) {
            var currentView = this.searchView;

            // Show's the jQuery Mobile loading icon
            $.mobile.loading( "show" );

            currentView.collection.url = '/search/track?q=' + query;

            // Fetches the Collection of Search Result Models for the current Search View
            currentView.collection.fetch().done( function() {

                $.mobile.loading( "hide" );

                //TODO

            } );

        }

    } );

    // Returns the Router class
    return MusocracyRouter;

} );