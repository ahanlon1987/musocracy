// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

var Persist = {


    amplify:Amplify,

    vote:function(track){

        var trackId = track.get('trackId') ;
        var trackName = track.get('name');
        var artists = track.get('artists');
        var album = track.get('album');

        console.log('Voting for trackId: ' + trackId +', trackName: ' + trackName + ', artists: ' + artists + ', album: ' + album) ;
        var amp = amplify;

        $.ajax({
            type: "POST",
            url: '/location/' + amplify.store('locationId')  + '/votes/' + trackId,
            data: {trackId:trackId, name:trackName, artists:artists, album:album},
            success: function() {
                console.log('200 returned from vote service, storing vote in local storage');
                var previousVotes = (amp.store('previousVotes') || []);
                previousVotes.push({
                    'trackId':trackId,
                    'voteTime':new Date()
                });

                amp.store('previousVotes', previousVotes);
                $('li[data-name="'+ trackId + '"]').addClass('ui-disabled glow');

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
                    amplify.store('locationId', data.locationId);
                    router.queue();
                } else {
                    console.log('No such location: ' + location);
                    $('label[for="locationId"]').html('Unable to find a location of ' + location + ', please try again.');
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