angular.module('app.services.healthKit')

 .factory('healthKitApi', ['$cordovaHealthKit', '$q',
  function($cordovaHealthKit, $q) {

    function getWalkingAndRunningDistance(){
      var deferred = $q.defer();
      console.log("in walkingRunningDistance: ");
      var queryObject = {
        'startDate' :  new Date(new Date().getTime()-50*24*60*60*1000),
        'endDate' : new Date(), 
        'sampleType': "HKQuantityTypeIdentifierDistanceWalkingRunning",
        'unit' : 'km' 
      };

      $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
        console.log("walkingRunningDistance: " + JSON.stringify(response));
        deferred.resolve(response);
      }, function(err) {
        alert(err);
       console.log(err);
       deferred.reject();
     });

      return deferred.promise;
    }

    function getWorkouts(){
      var deferred = $q.defer();

      $cordovaHealthKit.findWorkouts().then(function(rawWorkoutObjects) {
        deferred.resolve(rawWorkoutObjects);
      }, function(err) {
        console.log(err);
        deferred.reject();
      })


      return deferred.promise;
    }

    function getWorkoutDistanceAndCalories(rawWorkoutObject){
        // var deferred = $q.defer();
        // var distanceCaloriesObject = {};
        // getWorkoutDistance(rawWorkoutObject, distanceCaloriesObject).then(getWorkoutCalories(rawWorkoutObject, distanceCaloriesObject)).then(function(){
        //     deferred.resolve(distanceCaloriesObject);
        // });

        // return deferred.promise;

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
        console.log("distance: " + JSON.stringify(response));
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
        console.log("getWorkoutCalories: " + JSON.stringify(response));
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
  getWalkingAndRunningDistance: getWalkingAndRunningDistance
 // saveWorkouts: function(){
 //   $cordovaHealthKit.saveWorkout(
 //   {
 //    'activityType': 'HKWorkoutActivityTypeCycling',
 //    'quantityType': 'HKQuantityTypeIdentifierDistanceCycling',
 //            'startDate': new Date(), // now
 //            'endDate': null, // not needed when using duration
 //            'duration': 6000, //in seconds
 //            'energy': 400, //
 //            'energyUnit': 'kcal', // J|cal|kcal
 //            'distance': 5, // optional
 //            'distanceUnit': 'km'
 //        }
 //        ).then(function(v) {
 //        //alert(JSON.stringify(v));
 //    }, function(err) {
 //        console.log(err);
 //    });
 //    }
}}]
);