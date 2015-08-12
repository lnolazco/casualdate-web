angular.module('casualdateApp')
  .controller('mainCtrl',['$scope','statusService','geoService','userData', function ($scope, statusService, geoService, userData) {
    //obtiene localizacion del usuario
    var position = null;
    geoService.getCurrentPosition(function (pos) {
      position = pos;
    });

    //valida si el usuario esta logueado
    var userId = $("#userid").val();
    var userLogged = (userId !== undefined);
    //$scope.template = userLogged ? 'app/views/status.html' : 'app/views/login.html'; //'app/views/status.html'; //
    if (!userLogged) $scope.template = 'app/views/login.html';
    //si no lo esta oculta select
    if (!userLogged){
      $('#selDemo').hide();
      return;
    }
    userData.id = userId;
    //si esta logueado crea objecto select circular
    var images = ['img/status1.png',
            'img/status2.png',
            'img/status3.png'];
    SelectCircular('selDemo',images, 70, function(val){
      console.log('image selected: ' + val);
      //save status
      statusService.save(userId, val, position).$promise.then(function(success){
        //success
        console.log('saved status');
      });
    });

  }])
  .controller('mapCtrl',['$scope', 'uiGmapIsReady', 'geoService', 'statusService','contactService', function ($scope, uiGmapIsReady, geoService, statusService, contactService){

    var loadingContainer = $("<div class='map-container-loading'></div>");
    $(".map-container").append(loadingContainer);

    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        geoService.getCurrentPosition(function (position) {

          $scope.map.control.refresh({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
            }
          );
          //get and set markers
          setMarkers(position);

          $(".map-container-loading").remove();
        });
      });
    });

    $scope.map = geoService.map;
    $scope.map.options =  {
      disableDefaultUI: !0,
      mapTypeControl: !1,
      tilt: 45
    };
    $scope.markers = {
      models: [],
      control: {}
    };
    var setMarkers = function (position) {
      statusService.getMapStatuses(position,10).$promise.then(function (data) {
        var i = 1;
        data.forEach(function (d) {
          $scope.markers.models.push({
            id: i++,
            latitude: d.loc.lat,
            longitude: d.loc.lng,
            icon: 'img/status' + d.status + '-xs.png',
            userId: d.userId
          });
        });
      },
      function(reason){
        console.log('error: ' + reason);
      });
    };
    $scope.openContact = function (a, b, marker) {
      $scope.contact.position = {
        latitude: marker.latitude,
        longitude: marker.longitude,
      };
      contactService.getContact(marker.userId).$promise.then(function (success) {
        $scope.contact.model = {};
        if (success === undefined) return;
        $scope.contact.show = true;
        $scope.contact.model = success;
      });
    };
    $scope.closeClick = function () {
      $scope.contact = {
        show: false,
        model: {}
      };
    };
    $scope.contact = {
      show: false,
      model: {}
    };
  }])
  .controller('contactCtrl', ['$scope', 'contactService', 'userData', function ($scope, contactService, userData) {
    $scope.model = {};
    var userId = $("#userid").val();
    contactService.getContact(userId).$promise.then(function (success) {
      if (success.userId !== userId) return;
      $scope.model = success; // success[0] === undefined ? {} : success[0];
    });
    $scope.durations = [{id:1,name:"1 hr"},{id:4,name:"4 hrs"},{id:24,name:"1 day"}];
    $scope.ageRanges = [{id:1,name:"18 - 25"},{id:2,name:"26 - 40"},{id:3,name:"> 40"}];
    $scope.distances = [{id:1,name:"< 10 km"},{id:2,name:"10km - 30km"},{id:3,name:"> 30km"}];
    $scope.save = function () {
      $scope.model.userId = userId;
      //block controls
      contactService.save($scope.model).$promise.then(function (success) {
        console.log('saved');
        //unblock controls
      }, function (reason) {
        console.log('error: ' + reason);
      });
    };
  }]);
