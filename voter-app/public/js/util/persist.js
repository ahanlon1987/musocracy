// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

    var Persist = {


        amplify:Amplify,

//        TODO location id
//        vote:function(track, locationId){
        vote:function(track){

            var trackId = (track.get('trackId') || track.get('href')) ;
            var trackName = track.get('name');
            //TODO clean up this garbage
            var artist = (track.get('artists')[0].name || track.get('artist'));
            console.log('Voting for trackId: ' + trackId +', trackName: ' + trackName + ', artist: ' + artist) ;
            var amp = amplify;

            $.ajax({
              type: "POST",
              url: '/location/1/votes/' + trackId,
              data: {trackId:trackId, name:trackName, artist:artist},
              success: function() {
                  console.log('200 returned from vote service, storing vote in local storage');
                  var previousVotes = (amp.store('previousVotes') || []);
                  previousVotes.push(trackId);
                  amp.store('previousVotes', previousVotes);
                  router.queue();
              },
              failure:function(){
                  console.log('voting failed.');
              },
              dataType:'json'
            });

        }

    };

    return Persist;

} );