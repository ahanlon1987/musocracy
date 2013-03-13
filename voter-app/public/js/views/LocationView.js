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

            $("#location-submit").removeClass("hidden");
            $("#song-search").addClass('hidden');
            $("#results").empty();

            var curLocation = amplify.store('locationId');

            if (curLocation){
                $('label#location-label').html('Currently at: ' + curLocation);
            }

            $("#location-submit").submit(function(){
                var location = $("#location-input").val();
                if (location) {
                    router.persist.lookupLocation(location);
                } else {
                    console.log('No value found, enter a value and try again.');
                    $('label#location-label').html('Enter a value and try again.');
                }

                return false;
            });

            var queueView = this;

            // Maintains chainability
            return this;

        }

    } );

    // Returns the View class
    return QueueView;

} );