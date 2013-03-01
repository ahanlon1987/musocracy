// Persist Utils
// =============

// Includes file dependencies
define([ "jquery", "backbone" ], function( $, Backbone) {

    var Persist = {

//        TODO location id
//        vote:function(trackId, locationId){
        vote:function(trackId){

            console.log('Voting for ' + trackId);
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function(){
                if(this.readyState == this.DONE) {
                    if(this.status == 200)
                        console.log('200 returned from vote service');

                } else {
                    console.log('vote failed. this error message blows.');
                }
            };
            xmlhttp.open('POST','/location/1/votes/' + trackId, true);
            xmlhttp.send(trackId);

        }

    };

    return Persist;

} );