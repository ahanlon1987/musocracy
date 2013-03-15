// Sets the require.js configuration for your application.
require.config( {

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    paths: {

        // Core Libraries
        "hogan"       : "lib/hogan/hogan-2.0.0.amd",
        "jquery"      : "lib/jquery-1.9.1",
        "underscore"  : "lib/lodash",
        "backbone"    : "lib/backbone",
        "amplify"     : "lib/amplify.min",
        "scroller"    : "lib/scroller/Scroller",
        "bootstrap"   : "lib/bootstrap",
        "animate"     : "lib/scroller/Animate",
        "render"      : "lib/scroller/render",
        "raf"         : "lib/scroller/Raf"
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
require([ "jquery", "backbone", "hogan", "routers/Router", "scroller", "animate", "render", "raf" ], 
    function( $, Backbone, Hogan, Router, scroller, animate, render, raf) {


    this.router = new Router({
        el: $('.app')
    });
});


