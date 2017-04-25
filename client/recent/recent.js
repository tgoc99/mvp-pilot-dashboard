angular.module('pilotdb.recent',[])
.controller('recentController',function($scope, $http){

  $scope.searchedTrips = [];


  $http.get('/trips').then(function(data){
    console.log('data', data)
    data.data.forEach(item => {
      $scope.searchedTrips.push(item)
      console.log($scope.searchedTrips)
    })
  })



})