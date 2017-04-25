angular.module('pilotdb',[
  'pilotdb.input',
  'pilotdb.services',
  'pilotdb.recent',
  'ngRoute'
])
.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: './home.html'
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
