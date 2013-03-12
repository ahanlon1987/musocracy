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
            this.locationView = new LocationView({el: "#container-wrapper"});

            // Instantiates a new Search  View
            this.searchView = new SearchView( { el: "#container-wrapper", collection: new SearchCollection () } );

            // Instantiates a new Queue View
            this.queueView= new QueueView( { el: "#container-wrapper", collection: new QueueCollection() } );

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
                window.location.href = '#queue';
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
            } else {
                var currentView = this.queueView;
                currentView.collection.url = '/location/' + amplify.store('locationId') +'/votes';

                //Always refresh the queue
                currentView.collection.fetch().done( function() {

                } );
            }

        },

        search: function(query) {

            if(!amplify.store('locationId')){
                this.enterLocation();
            } else {
                var currentView = this.searchView;
                if(query){

                    currentView.collection.url = '/search/track?q=' + query;
                    currentView.collection.fetch().done( function() {
                    } );
                } else {

                    //No previous search?
                    if (currentView.collection.isEmpty()){
                        currentView.collection.reset(); //re-render a blank view

                        //Previous search in memory, show it
                    } else {
                        currentView.render();
                    }

                }
            }


        }
    } );

// Returns the Router class
    return MusocracyRouter;

} );