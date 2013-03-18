// Category View
// =============

// Includes file dependencies
define(["jquery", "underscore", "backbone", "templates", "models/QueueModel", "views/ListItemView", "collections/VotesCollection",
"collections/SpotifySearchCollection", "models/LocationModel", "util/persist", "util/dispatcher"],
function( $, _, Backbone, templates, QueueModel, ListItemView, VotesCollection, SpotifySearchCollection, LocationModel, persist, dispatcher) {

    // Extends Backbone.View
    var THREE_HOURS_IN_MS = 10800000;

    var timeoutId;
    return Backbone.View.extend({
        events: {
            'keyup .search input':'onKeyPress',
            'click .track:not(.disabled)':'onTrackClick'
        },

        // The View Constructor
        initialize: function() {
            this.locationId = this.options.locationId;
            dispatcher.on(dispatcher.events.REFRESH, this.onRefresh, this);
        },

        // Renders all of the Category models on the UI
        render: function() {
            this.$el.html(templates.queue.render());

            this.searchCollection = new SpotifySearchCollection();

            this.locationModel = new LocationModel({}, {
                locationId: this.locationId
            });

            this.locationModel.fetch({
                success:$.proxy(this.onLocationFetched, this)
            });

            // Maintains chainability
            return this;
        },

        renderQueue:function (tracks) {
            var html = '';
            _.each(tracks, function (track) {

                track.set('disabled', '');
                var index = $.inArray(track.get('trackId'), _.pluck(amplify.store('previousVotes'), 'trackId'));
                if (index >= 0){
                    var oldVote = amplify.store('previousVotes')[index];
                    if(oldVote){
                        if((new Date()) - (new Date(oldVote.voteTime)) < THREE_HOURS_IN_MS){
                            track.set('disabled', 'disabled');
                        }
                    }
                }

                html += templates.track.render(track.attributes);
            });

            this.$('.location-queue').html(html);
        },

        onRefresh:function () {
            this.locationModel.fetch({
                success:$.proxy(this.onLocationFetched, this)
            });
        },

        onLocationFetched: function() {
            var votesCollection = this.locationModel.getVotes();
            this.renderQueue(votesCollection.models);

            var nowPlaying = this.locationModel.getNowPlaying();
            if (nowPlaying) {
                this.$('.now-playing').html(templates.track.render(nowPlaying));
            }

            var upNext = this.locationModel.getUpNext();
            if (upNext) {
                this.$('.up-next').html(templates.track.render(upNext));
            }
        },

        onKeyPress:function(e) {
            window.clearTimeout(timeoutId);
            var query = this.$('.search input').val();
            if (e && e.which === 13) {
                this.search();
            }
            else {
                timeoutId = setTimeout($.proxy(this.search, this), 500);
            }

            this.filterVotesCollection(query);
        },

        onTrackClick:function(e) {
            (e && e.preventDefault());

            var trackId = $(e.currentTarget).data('trackid');
            var votes = this.locationModel.getVotes();
            var track = votes.getTrackById(trackId);
            if (!track) {
                track = this.searchCollection.getTrackById(trackId);
            }
            if (track) {
                persist.vote(track, {
                    success:function(resp) {
                        console.log('Voting complete.', resp);
                        dispatcher.trigger(dispatcher.events.REFRESH);

                    }
                });
            }
        },

        search:function(){
            var query = this.$('.search input').val();
            console.log('Executing search on: ' + query);

            var $spotifyResults = this.$('.spotify-results');
            $spotifyResults.html('Loading....');

            this.searchCollection.url = '/search/track?q=' + query;
            var self = this;
            this.searchCollection.fetch().done(function(){
                var html = '';
                self.searchCollection.each(function(model) {
                    html += templates.track.render(model.attributes);
                });

                $spotifyResults.html(html);
            });

        },

        filterVotesCollection:function (query) {
            var votesCollection = this.locationModel.getVotes();
            var models = votesCollection.getFilteredResults(query);
            this.renderQueue(models);
        }

    } );

} );