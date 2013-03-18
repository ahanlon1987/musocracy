define(['jquery', 'amplify', 'backbone', 'templates'], 
  function ($, amplify, Backbone, templates) {
    return Backbone.View.extend({
      events: {
        'submit #location-submit': 'submitLocation'
      },

      initialize:function () {

      },

      render:function () {
        this.$el.html(templates.home.render());
        return this;
      },

      submitLocation:function (e) {
        (e && e.preventDefault());
        var location = this.$("#location-input").val();
        if (location) {
          // router.persist.lookupLocation(location);
          this.verifyLocation(location);
        } else {
        console.log('No value found, enter a value and try again.');
          $('label#location-label').html('Enter a value and try again.');
        }

        return false;
      },

      verifyLocation:function(location) {
        var self = this;
        $.ajax({
            type: "GET",
            url: '/location/' + location,
            contentType: 'application/json',
            success: function(data) {
                console.log('200 returned from location service, check if locationId is null');
                if(data) {
                    console.log('found location: ' + data.locationId);
                    amplify.store('locationId', data.locationId, {expires:21600000}); //expire locationId after six hours.
                    window.location.href = '#location/' + data.locationId;

                } else {
                    console.log('No such location: ' + location);
                    self.$('label#location-label').html('Unable to find a location of ' + location + '.');
                }

            },
            failure:function(){
                console.log('Error trying to find location ' + location + ', please try again');
            }
        });
      }
    });
  });