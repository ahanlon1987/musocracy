musocracy
=========

# Node Application
1. Install nodejs
2. Install nodemon as global dependency
    * `npm install -g nodemon`
3. Install app dependencies: from inside voter-app directory:
    * `npm install`
    * This will install all package dependencies defined in the packages.json file into a node_modules folder
4. Run application
    * `node app.js`
    * Starts an http server on port 3000

# Voter Application Structure
* *app.js*: root app server
* */public/*: all client side resources
* */views*: views to be rendered server-side (static HTML for right now, but could be Mustache/Jade templates)
* */routes/*: all request handlers

# API
* `GET /search/track?q=QUERY`: search for tracks
* `GET /search/artist?q=QUERY`: search for artists
* `GET /search/album?q=QUERY`: search for albums* 
* `GET /lookup?uri=SPOTIFY_URI`: lookup metadata for specific artist, album, or track
    * ex: `GET /lookup?uri=spotify:track:6NmXV4o6bmp704aPGyTVVG`
* `POST /location/{id}/votes/{trackId}` : vote for a track at a specific location
* `GET /location/{id}/votes` : returns all votes for a given location
* `GET /location/{id}` : returns locationId if it exists
