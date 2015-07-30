angular.module('casualdateApp')
  .controller('mainCtrl',['$scope','authService',function ($scope, authService) {
    //valida si el usuario esta logueado
    var userLogged = ($("#userid").val() !== undefined);
    //$scope.template = userLogged ? 'app/views/status.html' : 'app/views/login.html'; //'app/views/status.html'; //
    if (!userLogged) $scope.template = 'app/views/login.html';
    //si no lo esta oculta select
    if (!userLogged){
      $('#selDemo').hide();
      return;
    }
    //si esta logueado crea objecto select circular
    var images = ['img/drink.png',
            'img/kiss.png',
            'img/devil-64.png'];
    SelectCircular('selDemo',images, 100, function(val){
      console.log('image selected: ' + val);
    });
  }])
  .controller('mapCtrl',['$scope', function ($scope){
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  }]);
