angular.module('pilotdb.input',[])
.controller('inputController',function($scope, $http, GetTrip){

  // CHANGING TO ONE PAGE ONE SEARCH
  // $http.get('/trips').then(function(data){
  //   data.data.forEach(item => {
  //     $scope.searchedTrips.push(item.trip)
  //     // console.log($scope.searchedTrips)
  //   })
  // })

  $scope.searchedTrips = [];

  if(GetTrip.getTrip()){
    $scope.searchedTrips.push(GetTrip.getTrip())
  }
  $scope.startDate = new Date('2017-04-27');
  $scope.SAStartDate= new Date('2017-04-29');
  $scope.endDate= new Date('2017-05-02');

  $scope.addTrip = function(){
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);
    var SAStartDate = new Date($scope.SAStartDate);

    // NEXT TWO LINES TO GET NUMBER OF DAYS OF TRIP
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*millisecond
    var tripDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    var daysToStart = Math.round(Math.abs((new Date() - startDate.getTime())/(oneDay)));
    console.log('daysToStart:', daysToStart)

    // Create an object (or array?) with the data for each day to push into the searched Trips array
    var objToPush = {};  /// MAKE AN ARRAY? or KEEP OBJ?
    for(var i =0; i<= tripDays; i++){
      var date = setDay(startDate, i);
      var city;
      if(date<SAStartDate){
        city = $scope.firstAirport;
      } else {
        city = $scope.secondAirport;
      }
      objToPush['day'+i] = {date:date, city: city, weather:'TBD'};
    }

    var objToPost = {
      startDate: startDate,
      daysToStart: daysToStart,
      secondStart: SAStartDate,
      airports: [$scope.firstAirport, $scope.secondAirport],
      days: tripDays,
      trip: objToPush
    };


    $http.post('/trips', objToPost)
    .then(function(data){
      $scope.searchedTrips = []
      $scope.searchedTrips.push(data.data);
      console.log('st:', $scope.searchedTrips)
    })


    // CHANGING TO ONE PAGE ONE SEARCH
    // .then(function(){
    //   $http.get('/trips').then(function(data){
    //     $scope.searchedTrips=[];
    //     data.data.forEach(item => {
    //       $scope.searchedTrips.push(item.trip);
    //       // console.log($scope.searchedTrips)
    //     })
    //   })
    // })

    // $scope.firstAirport=''; 
    // $scope.startDate ='';
    // $scope.secondAirport='';
    // $scope.SAStartDate='';
    // $scope.endDate='';
    // console.log('st:', $scope.searchedTrips);

  }
  var setDay = function (date, days){
    newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate;
  }
})