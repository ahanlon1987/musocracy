// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify" ], function( $, Backbone, Amplify) {


    var QueueView = Backbone.View.extend( {

        // The View Constructor
        initialize: function() {

            // The render method is called when Song Models are added to the Collection
//            this.collection.on( "reset", this.render, this );

        },

        amplify:Amplify,

        // Renders all of the Category models on the UI
        render: function() {

            // Sets the view's template property
            this.template = _.template( $( "script#location" ).html(), {} );

            //Renders the template
            this.$el.find("#page-container").empty();
            this.$el.find("#page-container").html(this.template);


            $("#location-submit").click(function(){
                var location = $("#locationId input").val();
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