angular.module('app.services.healthKit')

 .factory('healthKitApi', ['$cordovaHealthKit', '$q',
  function($cordovaHealthKit, $q) {

    function getWalkingAndRunningDistance(){
      var deferred = $q.defer();
      var queryObject = {
        'startDate' :  new Date(new Date().getTime()-50*24*60*60*1000),
        'endDate' : new Date(), 
        'sampleType': "HKQuantityTypeIdentifierDistanceWalkingRunning",
        'unit' : 'km' 
      };

      $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
        // console.log("#######getWalkingAndRunningDistance#######");
        // console.log(JSON.stringify(response));
        deferred.resolve(response);
      }, function(err) {
        alert(err);
       console.log(err);
       deferred.reject();
     });

      return deferred.promise;
    }

    function getWalkingAndRunningDistanceByDateTime(startDate, endDate){
      var deferred = $q.defer();
      var queryObject = {
        'startDate' :  new Date(startDate),
        'endDate' : new Date(endDate), 
        'sampleType': "HKQuantityTypeIdentifierDistanceWalkingRunning",
        'unit' : 'km' 
      };

      $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
        //         console.log("#######getWalkingAndRunningDistanceByDateTime#######");
        // console.log(JSON.stringify(response));
        deferred.resolve(response);
      }, function(err) {
        alert(err);
       console.log(err);
       deferred.reject();
     });

      return deferred.promise;
    }


    function getWorkouts(){
      return $cordovaHealthKit.findWorkouts();
    }

    function getWorkoutDistanceAndCalories(rawWorkoutObject){
        // taking out deferred antipattern
        return getWorkoutDistance(rawWorkoutObject, distanceCaloriesObject).then(getWorkoutCalories(rawWorkoutObject, distanceCaloriesObject));
    }

    function getWorkoutDistance(rawWorkoutObject, distanceCaloriesObject){
      var deferred = $q.defer();
      var sampleType;
      if (rawWorkoutObject.activityType == "HKWorkoutActivityTypeCycling"){
        sampleType = "HKQuantityTypeIdentifierDistanceCycling";
      }else{
        sampleType = "HKQuantityTypeIdentifierDistanceWalkingRunning";
      }

      console.log("Type: " + rawWorkoutObject.activityType);

      var queryObject = {
        'startDate' : new Date(rawWorkoutObject.startDate.replace(/-/g, "/")), 
        'endDate' : new Date(rawWorkoutObject.endDate.replace(/-/g, "/")), 
        'sampleType': sampleType,
        'unit' : 'km' 
      };

      $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
        distanceCaloriesObject.distance = response.quantity;
        deferred.resolve(response);
      }, function(err) {
        alert(err);
       console.log(err);
       deferred.reject();
     });

      return deferred.promise;
    }

    function getWorkoutCalories(rawWorkoutObject, distanceCaloriesObject){
      var deferred = $q.defer();
      console.log("in workoutCalories: " + JSON.stringify(rawWorkoutObject));
      var queryObject = {
        'startDate' : new Date(rawWorkoutObject.startDate.replace(/-/g, "/")), 
        'endDate' : new Date(rawWorkoutObject.endDate.replace(/-/g, "/")), 
        'sampleType': "HKQuantityTypeIdentifierActiveEnergyBurned",
        'unit' : 'kcal' 
      };

      $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
        distanceCaloriesObject.calories = response[0].quantity;
        deferred.resolve(response);
      }, function(err) {
        alert(err);
       console.log(err);
       deferred.reject();
     });

      return deferred.promise;
    }

return {
  getWorkouts: getWorkouts,
  getWorkoutDistance: getWorkoutDistance,
  getWorkoutCalories: getWorkoutCalories,
  getWorkoutDistanceAndCalories: getWorkoutDistanceAndCalories,
  getWalkingAndRunningDistance: getWalkingAndRunningDistance,
  getWalkingAndRunningDistanceByDateTime: getWalkingAndRunningDistanceByDateTime
}}]
);