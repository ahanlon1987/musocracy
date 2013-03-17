// Persist Utils
// =============

// Includes file dependencies
define(["jquery", "underscore", "backbone", "amplify"], function( $, _, Backbone, Amplify) {

var Persist = {


    amplify:Amplify,

    vote:function(track, options){

        var trackId = track.get('trackId') ;
        var trackName = track.get('name');
        var artists = track.get('artists');
        var album = track.get('album');
        var collType = track.collection.type;

        console.log('Voting for trackId: ' + trackId +', trackName: ' + trackName + ', artists: ' + artists + ', album: ' + album) ;
        var amp = amplify;

        $.ajax({
            type: "POST",
            url: '/location/' + amplify.store('locationId')  + '/votes/' + trackId,
            data: {trackId:trackId, name:trackName, artists:artists, album:album},
            success: function(resp) {
                var previousVotes = (amp.store('previousVotes') || []);
                previousVotes.push({
                    'trackId':trackId,
                    'voteTime':new Date()
                });
                amp.store('previousVotes', previousVotes);

                if(collType == 'Queue'){
                    //Automatically triggers a re-fetch
                    router.queue();
                }

                if (options && _.isFunction(options.success)) {
                    options.success(resp);
                }
            },
            failure:function(){
                console.log('voting failed.');
            },
            dataType:'json'
        });

    },


    lookupLocation: function(location) {

        $.ajax({
            type: "GET",
            url: '/location/' + location,
            data: {},
            success: function(data) {
                console.log('200 returned from location service, check if locationId is null');
                if(data) {
                    console.log('found location: ' + data.locationId);
                    amplify.store('locationId', data.locationId, {expires:21600000}); //expire locationId after six hours.
                    $("#location-submit").addClass("hidden");
                    window.location.href = '#';

                } else {
                    console.log('No such location: ' + location);
                    $('label#location-label').html('Unable to find a location of ' + location + '.');
                }

            },
            failure:function(){
                console.log('Error trying to find location ' + location + ', please try again');
            },
            dataType:'json'
        });
    }

};

return Persist;

} );