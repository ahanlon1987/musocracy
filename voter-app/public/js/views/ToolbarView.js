define(['jquery', 'underscore', 'backbone', 'templates', 'util/dispatcher'],
    function ($, _, Backbone, templates, dispatcher) {
        return Backbone.View.extend({
            events:{
                'click .icon-refresh':'refresh',
                'click .refresh':'refresh'
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
                this.startRefreshRotation();

                dispatcher.trigger(dispatcher.events.REFRESH);
            },

            startRefreshRotation:function () {
                var degrees = 0;
                var $refreshIcon = this.$('.icon-refresh');
                var rotate = function() {
                    degrees += 10;
                    $refreshIcon.css('transform', 'rotate(' + degrees + 'deg)');

                    if (degrees !== 360) {
                        setTimeout(rotate, 25);
                    }
                };
                rotate();
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