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
            'click .track:not(.disabled)':'onTrackClick',
            'click .clear-search':'onClearSearch'
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
//                track.set('domId', track.get('trackId').replace(":", "_"));

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
            } else if (e && e.which === 8 && query == ''){
                console.log('backspace pressed with no no content in search field, clearing search results');
                this.onClearSearch()
            }
            else {
                timeoutId = setTimeout($.proxy(this.search, this), 500);
            }

            this.filterVotesCollection(query);
        },

        onTrackClick:function(e) {
            (e && e.preventDefault());

            var $currentTarget = this.$(e.currentTarget);
            var trackId = $currentTarget.data('trackid');
            var votes = this.locationModel.getVotes();
            var track = votes.getTrackById(trackId);
            if (!track) {
                track = this.searchCollection.getTrackById(trackId);
            }
            if (track) {
                var self = this;
                persist.vote(track, {
                    success:function(resp) {
                        console.log('Voting complete.', resp);
//                        dispatcher.trigger(dispatcher.events.REFRESH);
                        self.locationModel = new LocationModel(resp, {locationId: self.locationId});
                        self.onLocationFetched();
                        self.highlightTrack(track);
                    }
                });

            }
        },

        highlightTrack:function(track) {
            var domId = track.get('domId');
            var $track = this.$('#' + domId);
            var origColor = $track.css('background-color');
            $track.animate({
                'background-color': "#C7F5C1"
            }, 750);

            setTimeout(function() {
                $track.animate({
                    'background-color': origColor
                }, 750);
            }, 500);
        },

        onClearSearch:function(e){

            //Clear the search text
            this.$('.search input').val('');
            //clear the spotify results div
            this.$('.spotify-results').empty();
            //Redraw the queue
            this.renderQueue(this.locationModel.getVotes().models);

        },

        search:function(){
            var query = this.$('.search input').val();
            console.log('Executing search on: ' + query);

            var $spotifyResults = this.$('.spotify-results');

            if(query){
                   $spotifyResults.html('Loading....');
                this.searchCollection.url = '/location/' + this.locationId + '/search/track?q=' + query;
                var self = this;
                this.searchCollection.fetch()
                    .done(function(){
                        var html = '';
                        if(!self.searchCollection.isEmpty()){
                            self.searchCollection.each(function(model) {
                                html += templates.track.render(model.attributes);
                            });
                        } else {
                            html = 'No Results Found, please try again.'
                        }
                        $spotifyResults.html(html);
                    }).fail(function(){
                        console.log('Handling failed spotify search, redrawing...');
                        $spotifyResults.html('Search failed, please try again.');

                    });
            } else {
                $spotifyResults.empty();
            }

        },

        filterVotesCollection:function (query) {
            var votesCollection = this.locationModel.getVotes();
            var models = votesCollection.getFilteredResults(query);
            this.renderQueue(models);
        }

    } );

} );