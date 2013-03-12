requirejs.config({
        // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    baseUrl: "js/lib",
     paths: {
        // "app": "../app",

         // Core Libraries
         "jquery": "jquery-1.9.1",
         // "jquerymobile": "lib/jquery.mobile-1.3.0",
         // "underscore"  : "lib/lodash",
         "underscore"  : "underscore",
         "backbone"    : "backbone",
         "amplify"     : "amplify.min"
         // "scroller"    : "lib/scroller/Scroller",
         // "animate"     : "lib/scroller/Animate",
         // "render"      : "lib/scroller/render",
         // "raf"         : "lib/scroller/Raf"
     },

     // Sets the configuration for your third party scripts that are not AMD compatible
     shim: {
        jquery: {
            exports: 'jquery'
        },
        underscore: { 
            exports: "_"
        },
        backbone: {
             deps: [ "underscore", "jquery" ],
             exports: "Backbone"  //attaches "Backbone" to the window object
         }

     } // end Shim Configuration
});