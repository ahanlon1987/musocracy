define(["jquery","backbone","models/QueueModel"],function(e,t,n){var r=t.Collection.extend({initialize:function(){},isEmpty:function(){return this.models.length<1},type:"Queue",model:n,comparator:function(e){return-e.get("votes")},parse:function(e){if(e)return e.playlist},getFilteredResults:function(e){return _.filter(this.models,function(t){return t.get("name")==e})}});return r});