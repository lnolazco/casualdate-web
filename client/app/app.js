angular.module('casualdateApp',['ngRoute','ngResource','uiGmapgoogle-maps'])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'mainCtrl'
      })
      .when('/main', {
        templateUrl: 'app/views/main.html',
        controller: 'mainCtrl'
      })
      .when('/settings', {
        templateUrl: 'app/views/settings.html',
        controller: 'mainCtrl'
      })
      .when('/map', {
        templateUrl: 'app/views/map.html',
        controller: 'mapCtrl'
      });
  });