define(["backbone","models/TrackModel"],function(e,t){var n=/[^A-Za-z\d]/g;return e.Collection.extend({model:t,initialize:function(){},comparator:function(e){return-e.get("votes")},getTrackById:function(e){return this.find(function(t){return t.get("trackId")===e})},getFilteredResults:function(e){return e&&(e=e.toLowerCase().replace(n,"")),_.filter(this.models,function(t){var r=t.get("name")||"";r=r.toLowerCase().replace(n,"");var i=t.get("artists")||"";return i=i.toLowerCase().replace(n,""),r.match(e)!=null||i.match(e)!=null})}})});