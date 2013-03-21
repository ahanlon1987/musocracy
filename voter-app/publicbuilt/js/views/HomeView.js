define(["jquery","amplify","backbone","templates"],function(e,t,n,r){return n.View.extend({events:{"submit #location-submit":"submitLocation"},initialize:function(){},render:function(){return this.$el.html(r.home.render()),this},submitLocation:function(e){e&&e.preventDefault();var t=this.$("#location-input").val();return t?this.verifyLocation(t):(console.log("No value found, enter a value and try again."),this.$("label#location-label").html("Enter a value and try again.")),!1},verifyLocation:function(n){var r=this;e.ajax({type:"GET",url:"/location/"+n,contentType:"application/json",success:function(e){console.log("200 returned from location service, check if locationId is null"),e?(console.log("found location: "+e.locationId),t.store("locationId",e.locationId,{expires:216e5}),window.location.href="/#location/"+e.locationId):(console.log("No such location: "+n),r.$("label#location-label").html("Unable to find a location of "+n+"."))},failure:function(){console.log("Error trying to find location "+n+", please try again")}})}})});