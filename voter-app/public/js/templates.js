define(function() {

  this["Templates"] = this["Templates"] || {};

  this["Templates"]["footer"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"navbar navbar-inverse navbar-fixed-bottom\">");_.b("\n" + i);_.b("    <div class=\"navbar-inner\">");_.b("\n" + i);_.b("        <div class=\"container\">");_.b("\n" + i);_.b("            &copy; 2013 All rights reserved.");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");return _.fl();;});

  this["Templates"]["home"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"container\" id=\"container-wrapper\">");_.b("\n" + i);_.b("    <form class=\"form-search\" id=\"location-submit\">");_.b("\n" + i);_.b("        <label id=\"location-label\"></label>");_.b("\n" + i);_.b("        <fieldset>");_.b("\n" + i);_.b("            <div class=\"input-append\">");_.b("\n" + i);_.b("                <input type=\"text\" placeholder=\"enter your location\" id=\"location-input\" class=\"span2 search-query\">");_.b("\n" + i);_.b("                <button type=\"submit\" class=\"btn\">Submit</button>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("        </fieldset>");_.b("\n" + i);_.b("    </form>");_.b("\n" + i);_.b("    <div id=\"logo-container\">");_.b("\n" + i);_.b("        <img src=\"/img/musocracy_logo.png\"/>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");return _.fl();;});

  this["Templates"]["infoFooter"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"navbar navbar-inverse navbar-fixed-bottom\">");_.b("\n" + i);_.b("    <div class=\"navbar-inner\">");_.b("\n" + i);_.b("        <div class=\"container\">");_.b("\n" + i);_.b("            <div class=\"now-playing pull-left\">");_.b("\n" + i);_.b("                <div class=\"label-small\">NOW PLAYING</div>");_.b("\n" + i);_.b("                <div class=\"track-small\">");_.b(_.v(_.f("nowPlayingTrackName",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("\n" + i);_.b("            <div class=\"up-next pull-right\">");_.b("\n" + i);_.b("                <div class=\"label-small\">UP NEXT</div>");_.b("\n" + i);_.b("                <div class=\"track-small\">");_.b(_.v(_.f("upNextTrackName",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");return _.fl();;});

  this["Templates"]["main"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='toolbar'>Toolbar goes here</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div class='body'>Body goes here</div>");_.b("\n" + i);_.b("\n" + i);_.b("<div class='footer'></div>");return _.fl();;});

  this["Templates"]["queue"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"container\" id=\"container-wrapper\">");_.b("\n" + i);_.b("\n" + i);_.b("    <!--<div>Now Playing: <div class=\"now-playing\"></div></div>-->");_.b("\n" + i);_.b("    <!--<div>Up Next: <div class=\"up-next\"></div></div>-->");_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"form-search search\">");_.b("\n" + i);_.b("        <!--<input type=\"text\" class=\"search-query\" placeholder=\"Song, Artist, or Album\"/>-->");_.b("\n" + i);_.b("        <div class=\"input-append\">");_.b("\n" + i);_.b("            <input type=\"text\" class=\"search-query span2\" placeholder=\"Song, Artist, or Album\">");_.b("\n" + i);_.b("            <span type=\"submit\" class=\"btn clear-search\"><i class=\"icon-remove\"/></span>");_.b("\n" + i);_.b("      </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <div class=\"location-queue\">");_.b("\n" + i);_.b("        <!-- <ul class=\"results\"/> -->");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div class=\"spotify-results\">");_.b("\n" + i);_.b("        <!-- <ul class=\"results\"/> -->");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("\n" + i);_.b("    <!--<div id=\"result-wrapper\">-->");_.b("\n" + i);_.b("        <!--<ul id=\"results\" class=\"media-list\"></ul>-->");_.b("\n" + i);_.b("    <!--</div>-->");_.b("\n" + i);_.b("</div>");return _.fl();;});

  this["Templates"]["search"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");return _.fl();;});

  this["Templates"]["toolbar"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"navbar navbar-inverse navbar-fixed-top\">");_.b("\n" + i);_.b("    <div class=\"navbar-inner\">");_.b("\n" + i);_.b("        <div class=\"container\">");_.b("\n" + i);_.b("            <a class=\"nav nav-back\" href=\"#\"><i class=\"icon-chevron-left icon-white\"></i></a>");_.b("\n" + i);_.b("            <div class=\"text-center\"><a id=\"home-link\" class=\"brand center\" href=\"/\">");_.b(_.v(_.f("title",c,p,0)));_.b("</a></div>");_.b("\n" + i);_.b("            <a id=\"header-search\" class=\"nav nav-search\" href=\"#\"><i class=\"icon-refresh icon-white\"></i></a>");_.b("\n" + i);_.b("            <!--<a id=\"header-search\" class=\"nav nav-search\" href=\"#\"><img class=\"refresh\" alt=\"Refresh\" src=\"img/arrow-big-03.png\"/></a>-->");_.b("\n" + i);_.b("            <form id=\"header-search-form\" class=\"hidden navbar navbar-search pull right\">");_.b("\n" + i);_.b("                <input id=\"header-song-search\" type=\"text\" class=\"search-query\" placeholder=\"Song, Artist, or Album\">");_.b("\n" + i);_.b("            </form>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");return _.fl();;});

  this["Templates"]["track"] = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div id=\"");_.b(_.v(_.f("domId",c,p,0)));_.b("\" class=\"track ");_.b(_.v(_.f("disabled",c,p,0)));_.b("\" data-trackid=\"");_.b(_.v(_.f("trackId",c,p,0)));_.b("\">");_.b("\n" + i);_.b("    <div class=\"metadata\">");_.b("\n" + i);_.b("        <div class=\"track-name\">");_.b(_.v(_.f("name",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("        <div class=\"artist-name\">");_.b(_.v(_.f("artists",c,p,0)));_.b(" - ");_.b(_.v(_.f("album",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("    <div class=\"votes\">");_.b(_.v(_.f("votes",c,p,0)));_.b("<i class=\"icon-arrow-up\"/></div>");_.b("\n" + i);_.b("</div>");_.b("\n" + i);_.b("\n" + i);_.b("\n");return _.fl();;});

  return this["Templates"];
});