define(['jquery', 'backbone', 'views/MainView'],
  function ($, Backbone, MainView) {
    return Backbone.Router.extend({
      routes: {
        '': 'root',
        'home': 'home',
        'location/:locationId': 'location'
      },

      initialize:function() {
        this.mainView = new MainView();
      },

      root:function() {
        var locationId = $.cookie('locationId');
        if (locationId) {
          this.location(locationId)
        } else {
          this.home();
        }
      }

      home:function() {
        this.mainView.showHomeView();
      },

      location:function(locationId) {
        this.mainView.showLocationView(locationId);
      }
    });
  });
