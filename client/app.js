angular.module('pilotdb',[
  'pilotdb.input',
  'pilotdb.services',
  'pilotdb.recent',
  'pilotdb.auth',
  'ngRoute'
])
.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: './home.html',
      controller: 'authController'
    })
    .when('/input',{
      templateUrl: './input/input.html',
      controller: 'inputController'
    })
    .when('/recent',{
      templateUrl: './recent/recent.html',
      controller: 'recentController'
    })
})
