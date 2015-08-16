angular.module('casualdateApp',['ngRoute','ngResource','uiGmapgoogle-maps', 'ui.bootstrap', 'ngFileUpload'])
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
        controller: 'contactCtrl'
      })
      .when('/map', {
        templateUrl: 'app/views/map.html',
        controller: 'mapCtrl'
      })
      .when('/signup', {
        templateUrl: 'app/views/signup.html'
      });
  })
  .value('userData', {
    timestampPosition: null,
    position: {},
    id: null
  })
  .value('chatData', {
    contactModel: {},
    myModel: {}
  });
