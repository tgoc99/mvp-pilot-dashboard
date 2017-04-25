angular.module('pilotdb.services', [])

.factory('GetTrip', function ($location) {
  var currentTrip;

  var setTrip = function(data){
    currentTrip = data;
    console.log('trip in factory', currentTrip)
    $location.path( "/input" );

  }

  var getTrip = function(){
    return currentTrip;
  }

  return{
    getTrip: getTrip,
    setTrip: setTrip
  };

})