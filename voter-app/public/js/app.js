// Sets the require.js configuration for your application.
require.config({

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    paths:{

        // Core Libraries
        "hogan":"lib/hogan/hogan-2.0.0.amd",
        "jquery":"lib/jquery-1.9.1",
        "underscore":"lib/lodash",
        "backbone":"lib/backbone",
        "amplify":"lib/amplify.min",
        "bootstrap":"lib/bootstrap"
    },

    // Sets the configuration for your third party scripts that are not AMD compatible
    shim:{

        backbone:{
            "deps":[ "underscore", "jquery" ],
            "exports":"Backbone"  //attaches "Backbone" to the window object
        },
        amplify:{
            exports:"amplify"
        }

    } // end Shim Configuration

});

// Includes File Dependencies
require([ "jquery", "backbone", "hogan", "routers/Router" ],
    function ($, Backbone, Hogan, Router) {


        this.router = new Router({
            el:$('body')
        });
    });


