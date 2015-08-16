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
  .controller('mapCtrl',['$scope', 'uiGmapIsReady', 'geoService', 'statusService','contactService','$modal','chatData', function ($scope, uiGmapIsReady, geoService, statusService, contactService, $modal, chatData){
    //define scope variables
    $scope.map = geoService.map;
    //default position
    $scope.map.options =  {
      disableDefaultUI: !0,
      mapTypeControl: !1,
      tilt: 45
    };
    $scope.markers = {
      models: [],
      control: {}
    };
    //add loading gif
    var loadingContainer = $("<div class='map-container-loading'></div>");
    $(".map-container").append(loadingContainer);

    //get my position
    uiGmapIsReady.promise(1).then(function(instances) {
      instances.forEach(function(inst) {
        geoService.getCurrentPosition(function (position) {

          $scope.map.control.refresh({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
            }
          );
          //get contacts that match with my settings and paint them on the map
          setMarkers(position);

          $(".map-container-loading").remove(); //remove loading gif
        });
      });
    });
    //get my contact information
    contactService.getContact($("#userid").val()).$promise.then(function (data) {
      if (typeof data === "undefined") return; //you need to add your contact information go to settings here.
      chatData.myModel = data;
    })
    //function to get contacts match with my settings
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
    //when the user click on a marker in the map => it opens a mapwindow with the contact information
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
        chatData.contactModel = success;
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
  .controller('chatCtrl',['$scope','$modal', function ($scope, $modal) {
    $scope.openChat = function () {
      var modalInstance = $modal.open({
        templateUrl: 'casualChat.html',
        controller: ['$scope','$modalInstance','chatData', function ($scope, $modalInstance, chatData) {
          $scope.contact = chatData.contactModel;
          $scope.me = chatData.myModel;

          //socket io
          var socket = io(); //.connect('http://89.140.139.178:3000');
          var myId = $scope.me.userId;
          var otherId = $scope.contact.userId;
          var conversation_id = myId > otherId ? myId + 'y' + otherId : otherId + 'y' + myId;
          socket.emit('subscribe', conversation_id);

          $scope.messages = [];
          $scope.sendMsg = function () {
            socket.emit('chat message',
              {
                room: conversation_id,
                message: {
                  alias: $scope.me.alias,
                  text: $scope.messageText
                }
              }
            );
            $scope.messageText = '';
          };
          //select picture
          var selectPicture = function (contact) {
            if (typeof contact.picture === "undefined" || contact.picture.length === 0){
              if (typeof contact.gender === "undefined") return "img/male.png";
              return contact.gender === 'M' ? 'img/male.png' : 'img/female.png';
            }
            else
              return contact.picture;
          };
          socket.on('conversation private post', function(data){
            var side, avatar;
            if (data.message.alias === $scope.me.alias){
              side = 'right';
              avatar = selectPicture($scope.me);
            }
            else{
              side = 'left';
              avatar = selectPicture($scope.contact);
            }
            $scope.$apply(function () {
              $scope.messages.push({
                side:  side,
                text: data.message.text,
                avatar: avatar
              });
            });
            // Animate
           $("#viewport-content").animate({
               bottom: $("#viewport-content").height() - $("#viewport").height()
           }, 250);
          });
        }],
        size: 'lg'
      });
    };
  }])
  .controller('contactCtrl', ['$scope', 'contactService', 'userData', 'Upload', function ($scope, contactService, userData, Upload) {
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
    //PICTURE
    $scope.$watch('file', function () {
        if ($scope.file != null)
            $scope.uploadAsText($scope.file);
    });
    $scope.uploadAsText = function(file){
      /* Convert the file to base64 data url */
      Upload.dataUrl(file, function(success){
              $scope.model.picture = success;
          }, function(err){
              console.log(err);
          });
    };

  }]);
