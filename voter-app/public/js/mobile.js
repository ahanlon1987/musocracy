// Sets the require.js configuration for your application.
require.config( {

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    paths: {

        // Core Libraries
        "jquery"      : "lib/jquery-1.9.1",
        "underscore"  : "lib/lodash",
        "backbone"    : "lib/backbone",
        "amplify"     : "lib/amplify.min",
        "bootstrap"   : "lib/bootstrap"
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
require([ "jquery", "backbone", "routers/mobileRouter", "collections/QueueCollection"], function( $, Backbone, MobileRouter, QueueCollection) {


    this.router = new MobileRouter();

    $("#header-search").click(function(){
        $("#header-search-form").removeClass('hidden');
        $("#home-link").css('display', 'none');
        $("#header-song-search").focus();
    });


    //TODO make this on search clear
    $("#header-song-search").blur(function(){
        $("#header-search-form").addClass('hidden');
        $("#home-link").css('display', 'block');
    });

});


