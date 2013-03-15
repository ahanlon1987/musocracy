define(['jquery', 'underscore', 'backbone', 'templates'], 
  function ($, _, Backbone, templates) {
    return Backbone.View.extend({
      initialize:function() {

      },

      render:function() {
        this.$el.html(templates.footer.render());
        return this;
      }
    });
  });