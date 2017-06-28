angular.module('pilotdb.auth',[])
.controller('authController',function($scope, $http, $location){

  $scope.user = {
    username: '',
    password: ''
  }

  $scope.register = () => {
    $http.post('/register', $scope.user).then(() => {
      $location.path("/input");
    })
  }

  $scope.login = () => {
    $http.post('/login', $scope.user).then(() => {
      $location.path("/input");
    })
  }



})