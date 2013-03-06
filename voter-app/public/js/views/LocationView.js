// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify" ], function( $, Backbone, Amplify) {


    var QueueView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

        },

        amplify:Amplify,

        render: function() {

            $("#location-submit").click(function(){
                var location = $("#locationId").val();
                if (location) {
                    router.persist.lookupLocation(location);
                } else {
                    console.log('No value found, enter a value and try again.');
                    $('label[for="locationId"]').html('No value found, enter a value and try again.');
                }
            });

            var queueView = this;

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return QueueView;

} );