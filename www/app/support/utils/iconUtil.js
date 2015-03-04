angular.module('app.utils')

.factory('iconUtil', function() {
	var iconDictionary = {};
	iconDictionary["HKWorkoutActivityTypeWalking"] = "";
	iconDictionary["HKWorkoutActivityTypeRunning"] = "ion-fireball";
	iconDictionary["HKWorkoutActivityTypeCycling"] = "ion-ios7-cart-outline";

    function getIcon(activityType){
		var icon = iconDictionary[activityType];
        return icon;
    }

  return {
    getIcon: getIcon
  };
});