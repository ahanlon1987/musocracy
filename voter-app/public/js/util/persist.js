// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone", "amplify"], function( $, Backbone, Amplify) {

    var Persist = {


        amplify:Amplify,

//        TODO location id
//        vote:function(trackId, locationId){
        vote:function(trackId){

            console.log('Voting for ' + trackId);
            var xmlhttp = new XMLHttpRequest();
            var amp = amplify;

            xmlhttp.onreadystatechange = function(){
                if(this.readyState == this.DONE) {
                    if(this.status == 200) {
                        console.log('200 returned from vote service, storing vote in local storage');
                        var previousVotes = (amp.store('previousVotes') || []);
                        previousVotes.push(trackId);
                        amplify.store('previousVotes', previousVotes);
                        router.queue();
                    } else {
                        console.log('vote failed. this error message blows.');
                    }
                }
            };
            xmlhttp.open('POST','/location/1/votes/' + trackId, true);
            xmlhttp.send(trackId);
        }

    };

    return Persist;

} );