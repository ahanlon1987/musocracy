
var locationService = require('../services/locationService').locationService;


exports.getLocation = function(req, resp) {

    var locationId = req.params.locationId;

    locationService.findLocation(locationId, {
             success:function(result) {
                 resp.writeHead(200, {'Content-Type':'application/json'});
                 resp.write(JSON.stringify(result));
                 resp.end();
             },
             error:function(err) {
                 resp.writeHead(500);
                 resp.write('Error finding location');
                 resp.end();
             }
         })

};
