angular.module('app.utils')

.factory('activityTypeUtil', function() {
	var workoutDictionary = {};

  /* avg running speed is 6m/h = 0.00268 km/sec */
  var RUNNING_SPEED = 0.00268;

    function isRunActivity(distanceInKm, durationInSec){
        var speed = distanceInKm/durationInSec;
        if (speed >= RUNNING_SPEED){
          return true;
        }
        return false;
    }

    /* determine activity type by velocity */
    function getActivityType(rawActivity){
      var distanceInKm = rawActivity.quantity;
      var durationInSec = moment(rawActivity.endDate).diff(moment(rawActivity.startDate),'seconds');
      var isRun = isRunActivity(distanceInKm, durationInSec);

      if (isRun){
        return "run";
      } else {
        return "walk";
      }

    }

  return {
    getActivityType: getActivityType
  }
});