// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

    var THREE_HOURS_IN_MS = 10800000;

    var ListItemView = Backbone.View.extend({

        tagName : "li",

        initialize: function(){
            _.bindAll(this, "setActive");
        },

        amplify:Amplify,

        render : function(model) {

            var index = $.inArray(model.get('trackId'), _.pluck(amplify.store('previousVotes'), 'trackId'));
            if (index >= 0){
                var oldVote = amplify.store('previousVotes')[index];
                if(oldVote){
                    if((new Date()) - (new Date(oldVote.voteTime)) < THREE_HOURS_IN_MS){
                        model.set('disableVote', 'ui-disabled');
                    }
                }
            }

            this.template = _.template( $( "script#songs" ).html(), { "model": model.toJSON()} );

            this.$el.attr('data-name', model.get('trackId')).addClass('song-list media').addClass(model.get('disableVote') ? 'disabled': '').html(this.template);

            this.model = model;

            return this;
        },

        events:{
            "click":"setActive"
        },

        setActive: function(event){

            var listItem = $(event.currentTarget);
            if(listItem[0]){
                if(!this.model.get('disableVote')){
                    $(listItem).animate({
                        opacity:.5
                    });
                    router.persist.vote(this.model);
                }
            }
        }
    });

    return ListItemView;

} );