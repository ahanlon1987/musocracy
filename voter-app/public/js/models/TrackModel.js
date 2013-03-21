define(['backbone'],
    function (Backbone) {
        return Backbone.Model.extend({
            initialize:function() {
                if (this.attributes.trackId) {
                    this.set('domId', this.attributes.trackId.replace(/:/g, '_'));
                }
            }
        });
    }
);