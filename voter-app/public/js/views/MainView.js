define(['jquery', 'underscore', 'backbone', 'templates', 'views/ToolbarView', 'views/FooterView', 'views/HomeView', 'views/LocationView'], 
  function($, _, Backbone, templates, ToolbarView, FooterView, HomeView, LocationView) {
    return Backbone.View.extend({

      initialize:function() {

      },

      render:function() {
        this.$el.html(templates.main.render({}));
        this.toolbarView = new ToolbarView({
          el:this.$('.toolbar')
        }).render();;

        this.footerView = new FooterView({
          el:this.$('.footer')
        }).render();

        return this;
      },

      showHomeView:function() {
        this.toolbarView.showHome();

        if (!this.homeView) {
          this.homeView = new HomeView().render();
        }
        this._updateView(this.homeView);
      },

      showLocationView:function(locationId) {
        // TODO: provide location name
        this.toolbarView.showLocation(locationId);

        if (!this.locationView) {
          this.locationView = new LocationView({
            locationId:locationId
          }).render();
        }
        this._updateView(this.locationView);
      },

      _updateView:function(view) {
        this.$('.body').html(view.el);
      }

    });
  });