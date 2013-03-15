define(['jquery', 'backbone', 'views/MainView'],
  function ($, Backbone, MainView) {
    return Backbone.Router.extend({

      routes: {
        '': 'root',
        'home': 'home',
        'location/:locationId': 'location'
      },

      initialize:function(options) {
        this.mainView = new MainView({
          el: options.el
        }).render();

        Backbone.history.start();
      },

      root:function() {
        // var locationId = $.cookie('locationId');
        var locationId = null;
        if (locationId) {
          this.location(locationId)
        } else {
          this.home();
        }
      },

      home:function() {
        this.mainView.showHomeView();
      },

      location:function(locationId) {
        this.mainView.showLocationView(locationId);
      }
    });
  });
