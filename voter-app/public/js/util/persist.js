// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

    var Persist = {


        amplify:Amplify,

//        TODO location id
//        vote:function(track, locationId){
        vote:function(track){

            var trackId = track.get('trackId') ;
            var trackName = track.get('name');
            var artists = track.get('artists');
            var album = track.get('album');

            console.log('Voting for trackId: ' + trackId +', trackName: ' + trackName + ', artists: ' + artists + ', album: ' + album) ;
            var amp = amplify;

            $.ajax({
              type: "POST",
              url: '/location/1/votes/' + trackId,
              data: {trackId:trackId, name:trackName, artists:artists, album:album},
              success: function() {
                  console.log('200 returned from vote service, storing vote in local storage');
                  var previousVotes = (amp.store('previousVotes') || []);
                  previousVotes.push({
                      'trackId':trackId,
                      'voteTime':new Date()
                    });
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