define(['jquery', 'underscore', 'backbone', 'templates', 'views/ToolbarView', 'views/HomeView', 'views/LocationView'], 
  function($, _, Backbone, templates, ToolbarView, HomeView, LocationView) {
    return Backbone.View.extend({

      initialize:function() {

      },

      render:function() {
        this.$el.html(templates.main({}));
        this.toolbarView = new ToolbarView();

        return this;
      },

      showHomeView:function() {
        this.toolbarView.showHome();

        if (!this.homeView) {
          this.homeView = new HomeView().render();
        }
        this._updateview(this.homeView.$el);
      },

      showLocationView:function(locationId) {
        // TODO: provide location name
        this.toolbarView.showLocation(locationId);

        if (!this.locationView) {
          this.locationView = new LocationView({
            locationId:locationId
          }).render();
        }
        this._updateview(this.locationView);
      },

      _updateView:function(view) {
        this.$('content').html(view);
      }

    });
  });