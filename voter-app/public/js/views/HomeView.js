define(['jquery', 'backbone', 'templates'], 
  function ($, Backbone, templates) {
    return Backbone.View.extend({
      initialize:function () {

      },

      render:function () {
        this.$el.html(templates.home.render());
        return this;
      }
    });
  });