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
                return this.get('nowPlaying');
            },

            getUpNext:function () {
                return this.get('upNext');
            }

        });

    });