var loopback = require('loopback');

module.exports = function(Status) {
  Status.nearby = function(lat, lng, max, fn) {

    var here = new loopback.GeoPoint({lat: lat, lng: lng});
    Status.find({
      // find locations near the provided GeoPoint
      where: {loc: {near: here, maxDistance: max}}
    }, fn);
  };

  Status.setup = function() {
    Status.base.setup.apply(this, arguments);

    this.remoteMethod('nearby', {
      description: 'Find nearby locations around the geo point',
      accepts: [
        {arg: 'lat', type: 'Number', required: true,description: 'geo location (lat)'},
        {arg: 'lng', type: 'Number', required: true,description: 'geo location (lng)'},
//        {arg: 'here', type: 'GeoPoint', required: true,description: 'geo location (lng & lat)'},
        {arg: 'max', type: 'Number', required: true, description: 'max distance in miles'}
      ],
      returns: {arg: 'locations', root: true},
      http: { verb: 'GET' }
    });
  };

  Status.setup();
};
