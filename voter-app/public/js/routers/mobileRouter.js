// Mobile Router
// =============

// Includes file dependencies
define([ "jquery","backbone", "amplify", "../collections/SearchCollection", "../collections/QueueCollection", "../views/SearchView", "../views/QueueView", "../views/LocationView", "../util/persist"],
function( $, Backbone, Amplify, SearchCollection, QueueCollection, SearchView, QueueView, LocationView, Persist) {

    // Extends Backbone.Router
    var MusocracyRouter = Backbone.Router.extend( {


        // The Router constructor
        initialize: function() {

            //Instantiates a new Location View
            this.locationView = new LocationView({el: "#home"});

            // Instantiates a new Search  View
            this.searchView = new SearchView( { el: "#content-wrapper", collection: new SearchCollection () } );

            // Instantiates a new Queue View
            this.queueView= new QueueView( { el: "#content-wrapper", collection: new QueueCollection() } );

            // Tells Backbone to start watching for hashchange events
            Backbone.history.start();

            this.persist = Persist;

        },

        amplify:Amplify,

        // Backbone.js Routes
        routes: {

            // When there is no hash bang on the url, the home method is called
            "": "home",

            "queue" : "queue",

            "search" : "search",

            "search?:query" : "search",

            "location" : "enterLocation"

        },

        // Home method
        home: function() {
            if(!amplify.store('locationId')){
                this.enterLocation();
            } else {
                this.queue();
            }
        },

        enterLocation: function(){

            //Double check what's stored locally is actually correct
            if(amplify.store('locationId')){
                Persist.lookupLocation(amplify.store('locationId'));
            } else {
                this.locationView.render();
            }

        },

        queue: function() {

            if(!amplify.store('locationId')){
                this.enterLocation();
            }

            var currentView = this.queueView;
            $.mobile.loading( "show" );
            currentView.collection.url = '/location/' + amplify.store('locationId') +'/votes';
            currentView.collection.fetch().done( function() {
                $.mobile.loading( "hide" );
            } );

        },

        search: function(query) {

            if(!amplify.store('locationId')){
                this.enterLocation();
            }

            var currentView = this.searchView;
            if(query){
                $.mobile.loading( "show" );
                currentView.collection.url = '/search/track?q=' + query;
                currentView.collection.fetch().done( function() {
                    $.mobile.loading( "hide" );
                } );
            } else {
                this.searchView.render();
            }
        }
    } );

// Returns the Router class
    return MusocracyRouter;

} );