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
            this.searchView = new SearchView( { el: "#content-wrapper", collection: new SearchCollection ( [] , { type: "search" } ) } );

            // Instantiates a new Queue View
            this.queueView= new QueueView( { el: "#content-wrapper", collection: new QueueCollection( [] , { type: "queue" } ) } );

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

        },

        // Backbone.js Routes
        routes: {

            // When there is no hash bang on the url, the home method is called
            "": "home",

            "queue" : "queue",

            "search" : "search",

            "search?:query" : "search"

        },

        // Home method
        home: function() {
            // Programatically changes to the search page
            $.mobile.changePage( "#search" , { reverse: false, changeHash: true } );

        },

        queue: function() {

            //Everytime the user hits queue we'll refresh

            var currentView = this.queueView;

            currentView.collection.url = '/location/1/votes';

            // Show's the jQuery Mobile loading icon
            $.mobile.loading( "show" );

            // Fetches the Collection of Queue Models for the current Queue View
            currentView.collection.fetch().done( function() {

                $.mobile.loading( "hide" );

                // Programatically changes to the current categories page
            } );

        },

        search: function(query) {
            var currentView = this.searchView;

            if(query){
                $.mobile.loading( "show" );
                currentView.collection.url = '/search/track?q=' + query;
                // Fetches the Collection of Search Result Models for the current Search View
                currentView.collection.fetch().done( function() {

                    $.mobile.loading( "hide" );

                } );
            } else {
                this.searchView.render();
//                currentView.collection.reset();
            }
        }
    } );

    // Returns the Router class
    return MusocracyRouter;

} );