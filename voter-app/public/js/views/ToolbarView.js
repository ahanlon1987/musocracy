define(['jquery', 'underscore', 'backbone', 'templates'], 
  function ($, _, Backbone, templates) {
    return Backbone.View.extend({
      initialize:function() {
        this.title = this.options.title || 'Musocracy';
      },

      render:function() {
        var templateJson = {
          title: this.title
        };

        this.$el.html(templates.toolbar.render(templateJson));
        return this;
      },

      showLocation:function (locationName) {
        this.$('.title').text(locationName);
        this.$('.back').show();
      },

      showHome:function() {
        this.$('.title').text('Musocracy');
        this.$('.back').hide();
      }
    });
  });