angular.module('app.utils')

.factory('activityTypeUtil', function() {
	var workoutDictionary = {};
	workoutDictionary["HKWorkoutActivityTypeWalking"] = "walk";
	workoutDictionary["HKWorkoutActivityTypeRunning"] = "run";
	workoutDictionary["HKWorkoutActivityTypeCycling"] = "cycle";

    function getWorkoutType(rawType){
		var activityType = workoutDictionary[rawType];
        return activityType;
    }

  return {
    getWorkoutType: getWorkoutType
  };
});