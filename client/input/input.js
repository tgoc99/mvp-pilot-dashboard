angular.module('pilotdb.input',[])
.controller('inputController',function($scope, $http, GetTrip){

  $scope.searchedTrips = [];
  // $scope.firstAirport="input airport code here (i.e. JFK)";
  // $scope.secondAirport="input airport code here (i.e. JFK)";
  


  if(GetTrip.getTrip()){
    $scope.searchedTrips.push(GetTrip.getTrip())
  }
  $scope.startDate = new Date('2017-04-28');
  $scope.SAStartDate= new Date('2017-05-02');
  $scope.endDate= new Date('2017-05-05');

  $scope.addTrip = function(){
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);
    var SAStartDate = new Date($scope.SAStartDate);

    // NEXT TWO LINES TO GET NUMBER OF DAYS OF TRIP
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*millisecond
    var tripDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    var daysToStart = Math.round(Math.abs((new Date() - startDate.getTime())/(oneDay)));

    // Create an object (or array?) with the data for each day to push into the searched Trips array

    var objToPost = {
      startDate: startDate,
      daysToStart: daysToStart,
      secondStart: SAStartDate,
      airports: [$scope.firstAirport, $scope.secondAirport],
      days: tripDays,
    };


    $http.post('/trips', objToPost)
    .then(function(data){
      $scope.searchedTrips = []
      $scope.searchedTrips.push(data.data);
      console.log('st:', $scope.searchedTrips)
    })

    // $scope.firstAirport=''; 
    // $scope.startDate ='';
    // $scope.secondAirport='';
    // $scope.SAStartDate='';
    // $scope.endDate='';

  }
})