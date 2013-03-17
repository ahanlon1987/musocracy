define(['jquery', 'underscore', 'backbone', 'templates', 'util/dispatcher'],
    function ($, _, Backbone, templates, dispatcher) {
        return Backbone.View.extend({
            events:{
                'click .icon-refresh':'refresh'
            },

            initialize:function () {
                this.title = this.options.title || 'Musocracy';
                this.searchShown = false;
            },

            render:function () {
                var templateJson = {
                    title:this.title
                };

                this.$el.html(templates.toolbar.render(templateJson));
                return this;
            },

            showLocation:function (locationName) {
                this.$('.brand').text(locationName);
                this.$('.back').show();
            },

            showHome:function () {
                this.$('.brand').text('Musocracy');
                this.$('.back').hide();
            },

            refresh:function (e) {
                (e && e.preventDefault());
                dispatcher.trigger(dispatcher.events.REFRESH);
            },

            toggleSearch:function (e) {
                (e && e.preventDefault());

                this.searchShown ? this.showSearch() : this.hideSearch();
            },

            showSearch:function () {
                this.$('.search').show();
                dispatcher.trigger(dispatcher.events.SHOW_SEARCH);
            },

            hideSearch:function () {
                this.$('.search').hide();
                dispatcher.trigger(dispatcher.events.HIDE_SEARCH);
            },

            clearSearch:function () {
                this.$('.search input').val('');
                dispatcher.trigger(dispatcher.events.CLEAR_SEARCH);
            }
        });
    });