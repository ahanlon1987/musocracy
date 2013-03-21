define(['jquery', 'underscore', 'backbone', 'templates'],
    function ($, _, Backbone, templates) {
        return Backbone.View.extend({
            initialize:function() {
//                this.nowPlaying = this.options.nowPlaying;
//                this.upNext = this.options.upNext;

                this.locationModel = this.options.locationModel;
                _.each(['change'], function(eventName) {
                    this.locationModel.on(eventName, this.render, this);
                }, this);
            },

            render:function() {
                var nowPlaying = this.locationModel.getNowPlaying(),
                    upNext = this.locationModel.getUpNext();
                this.$el.html(templates.infoFooter.render({
                    nowPlayingTrackName:(nowPlaying && nowPlaying.name) || '',
                    upNextTrackName:(upNext && upNext.name) || ''
                }));
                return this;
            }
        });
    });