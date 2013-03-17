// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify", "templates", "models/QueueModel", "views/ListItemView", "collections/VotesCollection",
    "collections/SpotifySearchCollection", "models/LocationModel", "util/persist"],
    function( $, Backbone, Amplify, templates, QueueModel, ListItemView, VotesCollection, SpotifySearchCollection, LocationModel, persist) {

    // Extends Backbone.View
    var THREE_HOURS_IN_MS = 10800000;

    var timeoutId;
    return Backbone.View.extend({
        events: {
            'keyup .search input':'onKeyPress',
            'click .track':'onTrackClick'
        },

        // The View Constructor
        initialize: function() {
            this.locationId = this.options.locationId;

            // this.collection = new QueueCollection();

            // The render method is called when Song Models are added to the Collection
            // this.collection.on( "reset", this.render, this );

            //Handles search action, waits until .5s of no keypress to fire
            // $('#header-song-search').keypress(function(e) {
            //     console.log('key pressed');
            //     clearTimeout($.data(this, 'timer'));
            //     var wait = setTimeout(router.queueView.search, 500);
            //     $(this).data('timer', wait);
            // });
        },

        amplify:Amplify,

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

            // this.locationCollection.url = '/location/' + this.locationId;
            // $.when(this.locationCollection.fetch({
            //     contentType:'application/json'
            // })).then($.proxy(this.onLocationFetched, this));


            // this.$("#song-search").addClass('hidden');

            // Renders the view's template inside of the current listview element
            // this.$el.find('ul.results').empty();
            // var self = this;
            // this.collection.each(function(model){
            //     var listItemView = new ListItemView();
            //     self.$('ul.results').append(listItemView.render(model).$el);
            // });

            // Maintains chainability
            return this;
        },

        renderQueue:function (tracks) {
            var html = '';
            _.each(tracks, function (track) {
                html += templates.track.render(track.attributes);
            });

            this.$('.location-queue').html(html);
        },

        onLocationFetched: function() {
            var html = '';
            var votesCollection = this.locationModel.getVotes();
            this.renderQueue(votesCollection.models);
            // votesCollection.each(function(track) {
                // html += templates.track.render(track);
            // });

            // this.$('.location-queue').html(html);

            var nowPlaying = this.locationModel.getNowPlaying();
            if (nowPlaying) {
                this.$('.now-playing').html(templates.track.render(track));
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
            var track = this.searchCollection.getTrackById(trackId);
            if (track) {
                persist.vote(track, function(resp) {
                    console.log('Voting complete.', resp);
                });
            }
        },

        search:function(){
            var query = this.$('.search input').val();
            console.log('Executing search on: ' + query);

            //TODO use the unfiltered collection to re-render this view once the search is cleared out.

            var $spotifyResults = this.$('.spotify-results');
            $spotifyResults.html('Loading....');

//            var searchResults = new SpotifySearchCollection();
//            searchResults.url = '/search/track?q=' + query;
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