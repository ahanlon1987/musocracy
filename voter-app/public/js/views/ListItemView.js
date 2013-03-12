// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone"], function( $, Backbone) {


    var ListItemView = Backbone.View.extend({

        tagName : "li",

        initialize: function(){
            _.bindAll(this, "setActive");
        },

        render : function(model) {
            this.template = _.template( $( "script#songs" ).html(), { "model": model.toJSON()} );

            this.$el.attr('data-name', model.get('trackId')).addClass('song-list media').html(this.template);

            this.model = model;

            return this;
        },

        events:{
            "click":"setActive"
        },

        setActive: function(event){
            console.log('click event fired!');
            var listItem = $(event.currentTarget);
            if(listItem[0]){
                $(listItem).animate({
                    opacity:.5
                })
            }

            router.persist.vote(this.model);


        }

    });

    return ListItemView;

} );