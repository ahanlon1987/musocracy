define(['jquery', 'underscore', 'backbone', 'templates'],
  function($, _, Backbone, templates) {
    return Backbone.View.extend({
      initialize:function() {
        this.tracks = new Backbone.Collection();
      },

      render:function() {
        var html = '';
        _.each(this.tracks, function(track) {
          html += templates.track(track.attributes);
        });

        this.$el.html(html);

        return this;
      }
    })
  })