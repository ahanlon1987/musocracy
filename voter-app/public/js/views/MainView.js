define(['jquery', 'underscore', 'backbone', 'templates', 'models/LocationModel', 'views/ToolbarView', 'views/InfoFooterView', 'views/HomeView', 'views/QueueView'],
    function ($, _, Backbone, templates, LocationModel, ToolbarView, InfoFooterView, HomeView, QueueView) {
        return Backbone.View.extend({

            initialize:function () {
            },

            render:function () {
                this.$el.html(templates.main.render({}));
                this.toolbarView = new ToolbarView({
                    el:this.$('.toolbar')
                }).render();
                ;



                return this;
            },

            showHomeView:function () {
                this.toolbarView.showHome();

                if (!this.homeView) {
                    this.homeView = new HomeView().render();
                }
                this._updateBody(this.homeView);

                if (!this.footerView) {
                    this.footerView = new InfoFooterView({
                        el:this.$('.footer')
                    }).render();
                }
            },

            showLocationView:function (locationId) {
                // TODO: provide location name
                this.toolbarView.showLocation(locationId);

                if (!this.locationModel) {
                    this.locationModel = new LocationModel(null, {
                        locationId: locationId
                    });
                }

                if (!this.locationView) {
//                    this.locationModel = new LocationModel({}, {
//                        locationId:this.locationId
//                    });
                    this.locationModel.set('locationId', this.locationId);
                    this.locationView = new QueueView({
                        locationId:locationId,
                        locationModel: this.locationModel
                    }).render();
                }
                this._updateBody(this.locationView);

                if (!this.locationFooterView) {
                    this.locationFooterView = new InfoFooterView({
                        locationModel:this.locationModel
                    }).render();
                }
                this._updateFooter(this.locationFooterView);
            },

            _updateBody:function (view) {
                this.$('.body').html(view.el);
            },

            _updateFooter:function (view) {
                this.$('.footer').html(view.el);
            }

        });
    });