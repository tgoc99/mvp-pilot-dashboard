angular.module('app',[])
.controller('main',function($scope, $http){
  $scope.searchedTrips = [];
  $scope.startDate = new Date('2017-01-02');
  $scope.SAStartDate= new Date('2017-01-05');
  $scope.endDate= new Date('2017-01-08');

  $scope.addTrip = function(){
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);
    var SAStartDate = new Date($scope.SAStartDate);

    // NEXT TWO LINES TO GET NUMBER OF DAYS OF TRIP
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*millisecond
    var tripDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));

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

    $scope.searchedTrips.push(objToPush);

    var objToPost = {
      days: tripDays,
      trip: objToPush
    };
    
    $http.post('/trips', objToPost);

    


    // $scope.firstAirport=''; 
    // $scope.startDate ='';
    // $scope.secondAirport='';
    // $scope.SAStartDate='';
    // $scope.endDate='';
    console.log('st:', $scope.searchedTrips);




  }
  var setDay = function (date, days){
    newDate = new Date(date)
    newDate.setDate(newDate.getDate() + days)
    return newDate;
  }
})