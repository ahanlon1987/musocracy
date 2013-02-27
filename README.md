musocracy
=========

# Node Application
1. Install nodejs
2. From inside voter-app directory:
    * `npm install`
    * This will install all package dependencies defined in the packages.json file into a node_modules folder
3. Run applicatoin
    * `node app.js`
    * Starts an http server on port 3000

# Voter Application Structure
* *app.js*: root app server
* */public/*: all client side resources
* */views*: views to be rendered server-side (static HTML for right now, but could be Mustache/Jade templates)
* */routes/*: all request handlerss