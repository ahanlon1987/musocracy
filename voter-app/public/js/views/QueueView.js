// Category View
// =============

// Includes file dependencies
define([ "jquery", "backbone","amplify", "templates", "models/QueueModel", "views/ListItemView", "collections/QueueCollection" ], 
    function( $, Backbone, Amplify, templates, QueueModel, ListItemView, QueueCollection) {

    // Extends Backbone.View
    var THREE_HOURS_IN_MS = 10800000;

    var QueueView = Backbone.View.extend({

        // The View Constructor
        initialize: function() {
            this.collection = new QueueCollection();

            // The render method is called when Song Models are added to the Collection
            this.collection.on( "reset", this.render, this );

            //Handles search action, waits until .5s of no keypress to fire
            $('#header-song-search').keypress(function(e) {
                console.log('key pressed');
                clearTimeout($.data(this, 'timer'));
                var wait = setTimeout(router.queueView.search, 500);
                $(this).data('timer', wait);
            });
        },

        amplify:Amplify,

        // Renders all of the Category models on the UI
        render: function() {
            this.$el.html(templates.queue.render());

            this.$("#song-search").addClass('hidden');

            // Renders the view's template inside of the current listview element
            this.$el.find('ul.results').empty();
            var self = this;
            this.collection.each(function(model){
                var listItemView = new ListItemView();
                self.$('ul.results').append(listItemView.render(model).$el);
            });

            // Maintains chainability
            return this;
        },


        search:function(){
            var query = $('#header-song-search').val();
            console.log('Executing search on: ' + query);

            //TODO use the unfiltered collection to re-render this view once the search is cleared out.
            var filteredCollection = new QueueCollection(router.queueView.collection.getFilteredResults(query));
            router.queueView.collection.reset(filteredCollection.models);

            $('#search-results ul.results').html('Loading....');

            var searchResults = new QueueCollection();
            searchResults.url = '/search/track?q=' + query;
            searchResults.fetch().done(function(){
                var searchResultsView = new QueueView({ el: "#search-results", collection: searchResults });
                searchResultsView.render();
            });

        }

    } );

    return QueueView;

} );