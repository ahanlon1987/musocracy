// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

    var Persist = {


        amplify:Amplify,

//        TODO location id
//        vote:function(trackId, locationId){
        vote:function(trackId, trackName){

            console.log('Voting for trackId: ' + trackId +', trackName: ' + trackName) ;
            var amp = amplify;

            $.ajax({
              type: "POST",
              url: '/location/1/votes/' + trackId,
              data: {trackId:trackId, name:trackName},
              success: function() {
                  console.log('200 returned from vote service, storing vote in local storage');
                  var previousVotes = (amp.store('previousVotes') || []);
                  previousVotes.push(trackId);
                  amplify.store('previousVotes', previousVotes);
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