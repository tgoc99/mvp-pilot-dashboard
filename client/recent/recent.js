angular.module('pilotdb.recent',[])
.controller('recentController',function($scope, $http, GetTrip){

  $scope.searchedTrips = [];

  $scope.clickForData = function(data){
    console.log('clickdata', data)
    GetTrip.setTrip(data);
  }


  $http.get('/trips').then(function(data){
    console.log('data', data)
    data.data.forEach(item => {
      $scope.searchedTrips.push(item)
      console.log($scope.searchedTrips)
    })
  })



})