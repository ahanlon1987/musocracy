define(['backbone'],
    function (Backbone) {

        var regex = /[^A-Za-z\d]/g;
        return Backbone.Collection.extend({

            initialize:function () {

            },

            parse: function(response){
                return response.playlist;
            },

            getTrackById:function (trackId) {
                return this.find(function(model) {
                    return model.get('trackId') === trackId;
                });
            },

            // filter results by name and artist, ignore case, special chars, and whitespace for now
            getFilteredResults:function (filter) {
                if (filter) {
                    filter = filter.toLowerCase.replace(regex, '');
                }

                return _.filter(this.models, function(model) {
                    var name = model.get('name') || '';
                    name = name.toLowerCase().replace(regex, '');

                    var artists = model.get('artists') || '';
                    artists = artists.toLowerCase().replace(regex, '');
                    return name.contains(filter) || artists.contains(filter);
                });
            }



        });
    });