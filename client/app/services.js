angular.module('casualdateApp')
.factory('authFactory',['$resource', function($resource){
  return $resource('/auth/local', {}, {
              save: { method: 'POST'},
              update: { method: 'PUT' },
              remove: { method: 'DELETE'},
              query: {
                  method: 'GET',
                  isArray: true
              }
          });
}])
.service('authService',['authFactory', function (authFactory) {
  this.login = function (username, password) {
    var formData = {
      username:username,
      password:password};
    return authFactory.save({},{formData});
  };
  return this;
}]);
