// Sets the require.js configuration for your application.
require.config( {

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    paths: {

        // Core Libraries
        "jquery": "lib/jquery-1.9.1",
        "jquerymobile": "lib/jquery.mobile-1.3.0",
        "underscore": "lib/lodash",
        "backbone": "lib/backbone",
        "amplify" : "lib/amplify.min",
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {

        "backbone": {
            "deps": [ "underscore", "jquery" ],
            "exports": "Backbone"  //attaches "Backbone" to the window object
        }

    } // end Shim Configuration

} );

// Includes File Dependencies
require([ "jquery", "backbone", "routers/mobileRouter" ], function( $, Backbone, Mobile ) {

    $( document ).on( "mobileinit",
        // Set up the "mobileinit" handler before requiring jQuery Mobile's module
        function() {
            // Prevents all anchor click handling including the addition of active button state and alternate link bluring.
            $.mobile.linkBindingEnabled = false;

            // Disabling this will prevent jQuery Mobile from handling hash changes
            $.mobile.hashListeningEnabled = false;
        }
    );

    require( [ "jquerymobile" ], function() {
        // Instantiates a new Backbone.js Mobile Router
        this.router = new Mobile();

    });


    //Handles search action,
    $("#search-form").submit(function() {
        var element =  $('input[name="song-search"]');
        element.blur();
        window.location.href = '#search?' + element.val();

        return false;
    });

} );