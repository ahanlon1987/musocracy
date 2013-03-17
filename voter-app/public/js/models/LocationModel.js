define(['underscore', 'backbone', 'collections/VotesCollection'],
    function (_, Backbone, VotesCollection) {
        return Backbone.Model.extend({
            initialize:function (attributes, options) {
                this.locationId = options.locationId;
                this.on('reset', this.onReset, this);
            },

            url:function () {
                return '/location/' + this.locationId;
            },

            // parse:function (response) {

            // },

            onReset:function () {
                this.set('votes', new VotesCollection(this.attributes.votes));
            },

            getVotes:function () {
                var votes = this.get('votes');
                if (!(votes instanceof VotesCollection)) {
                    votes = new VotesCollection(votes);
                    this.set('votes', votes);
                }
                return votes;
            },

            getNowPlaying:function () {
                var playlist = this.get('playlist') || [],
                    i = playlist.length - 1;

                // return the last track that has been marked played
                for (; i >= 0; i--) {
                    if (playlist[i].played) {
                        return playlist[i];
                    }
                }

                return null;
            },

            getUpNext:function () {
                var playlist = this.get('playlist') || [];

                // return the first track that has not been played
                return _.find(playlist, function (track) {
                    return !track.played;
                });
            }

        });

    });