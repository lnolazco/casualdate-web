angular.module('casualdateApp')
.factory('statusFactory',['$resource', function($resource){
  return $resource('/api/statuses', {}, {
              save: { method: 'POST'},
              update: { method: 'PUT' },
              remove: { method: 'DELETE'},
              query: { method: 'GET', isArray: true}
          });
}])
.factory('nearbyFactory',['$resource', function($resource){
  return $resource('/api/statuses/nearby', {}, {
              query: { method: 'GET', isArray: true, params: {lat: '@lat',lng: '@lng', max: '@max'}}
          });
}])
.service('statusService',['statusFactory', 'nearbyFactory', function (statusFactory, nearbyFactory) {
  this.save = function (userId, status, position) {
    var status = {
      userId:userId,
      status:status,
      loc: {
        lng: position.coords.longitude,
        lat: position.coords.latitude
      },
      timestamp: new Date()
      };
    return statusFactory.save({},status);
  };
  this.getMapStatuses = function (position, max) {
    return nearbyFactory.query({},{
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      max: max
    });
  };
  return this;
}])
.service('geoService', ['$resource', '$http', 'userData', function($resource, $http, userData) {
  this.geocoder = new google.maps.Geocoder();
  this.getCurrentPosition = function(f) {
      if (userData.timestampPosition !== null){
        console.log('reuse user position');
        f.call(null, userData.position);
        return;
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log('got user position');
          userData.timestampPosition = new Date();
          userData.position = position;
          f.call(null, position);
        });
      } else {
        alert('Unable to locate current position');
      }
    };
    this.map = {
      center: { latitude: 41.4, longitude: 2.2},
      zoom: 14,
      control: {},
      bounds: {}
    };
  }
])
.factory('contactFactory',['$resource', function ($resource) {
  return $resource('/api/contacts/:option',{},{
    save: { method: 'POST'},
    update: { method: 'PUT' },
    get: {method: 'GET', isArray: false,params: {filter:'@filter'}}
  });
}])
.service('contactService',['contactFactory',function (contactFactory) {
  this.getContact = function (userId) {
    return contactFactory.get({option:'findOne'},{ //{ option: 'findOne'},{
      filter: {
        where: {userId: userId}
      }
    });
  };
  this.save = function (contact) {
    if (contact.id !== undefined)
      return contactFactory.update(contact);
    else
      return contactFactory.save(contact);
  }
}]);
