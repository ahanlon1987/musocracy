// Sets the require.js configuration for your application.
require.config( {

    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.2.min")
    paths: {

        // Core Libraries
        "jquery": "lib/jquery-1.9.1",
        "underscore"  : "lib/lodash",
        "backbone"    : "lib/backbone",
        "amplify"     : "lib/amplify.min",
        "scroller"    : "lib/scroller/Scroller",
//        "bootstrap"   : "lib/bootstrap.min",
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
require([ "jquery", "backbone", "bootstrap", "routers/mobileRouter", "scroller", "animate", "render", "raf"], function( $, Backbone, bootstrap, MobileRouter, scroller, animate, render, raf) {

    this.router = new MobileRouter();

    //Handles search action,
    $("#song-search").submit(function() {
        var element =  $('#song-search-input');
        element.blur();
        window.location.href = '#search?' + element.val();

        return false;
    });

});

//TODO put pull-to-refresh back in
//    var container = document.getElementById("container");
//    var content = document.getElementById("content");
//    var refreshElem = document.getElementById("refresh-container");
//
//    // Initialize Scroller
//    var scroller = new Scroller(this.render, {
//        scrollingX: false
//    });
//
//    // Activate pull-to-refresh
//    scroller.activatePullToRefresh(50, function() {
//        refreshElem.className += " active";
//        refreshElem.innerHTML = "Release to Refresh";
//    }, function() {
//        refreshElem.className = refreshElem.className.replace(" active", "");
//        refreshElem.innerHTML = "Pull to Refresh"
//        ;
//    }, function() {
//        refreshElem.className += " running";
////        $.mobile.loading( "show" );
//        router.queueView.collection.fetch().done( function() {
//            scroller.finishPullToRefresh();
////            $.mobile.loading( "hide" );
//        });
//    });
//
//    var rect = container.getBoundingClientRect();
//    scroller.setPosition(rect.left+container.clientLeft, rect.top+container.clientTop);
//
//    //TODO make this jquery-ish
//    if ('ontouchstart' in window) {
//        refreshElem.addEventListener("touchstart", function(e) {
//            // Don't react if initial down happens on a form element
//            if (e.target.tagName.match(/input|textarea|select/i)) {
//                return;
//            }
//            scroller.doTouchStart(e.touches, e.timeStamp);
//            e.preventDefault();
//        }, false);
//        document.addEventListener("touchmove", function(e) {
//            scroller.doTouchMove(e.touches, e.timeStamp);
//        }, false);
//        document.addEventListener("touchend", function(e) {
//            scroller.doTouchEnd(e.timeStamp);
//        }, false);
//
//    } else {
//
//        var mousedown = false;
//        refreshElem.addEventListener("mousedown", function(e) {
//            // Don't react if initial down happens on a form element
//            if (e.target.tagName.match(/input|textarea|select/i)) {
//                return;
//            }
//            scroller.doTouchStart([{
//                pageX: e.pageX,
//                pageY: e.pageY
//            }], e.timeStamp);
//
//            mousedown = true;
//        }, false);
//
//        document.addEventListener("mousemove", function(e) {
//            if (!mousedown) {
//                return;
//            }
//            scroller.doTouchMove([{
//                pageX: e.pageX,
//                pageY: e.pageY
//            }], e.timeStamp);
//
//            mousedown = true;
//        }, false);
//
//        document.addEventListener("mouseup", function(e) {
//            if (!mousedown) {
//                return;
//            }
//
//            scroller.doTouchEnd(e.timeStamp);
//            mousedown = false;
//        }, false);
//
//    }


