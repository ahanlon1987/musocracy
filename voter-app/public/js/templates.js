define(function() {

  this["Templates"] = this["Templates"] || {};

  this["Templates"]["track"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"track\">");_.b("\n" + i);_.b("    <div class=\"track-name\">");_.b(_.v(_.d("track.trackName",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    <div class=\"artist-name\">");_.b(_.v(_.d("track.artist",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("  </div>");_.b("\n" + i);_.b("  <div><i class=\"icon-upvote icon-white\"/></div>");_.b("\n" + i);_.b("</div>");return _.fl();;});

  return this["Templates"];
});