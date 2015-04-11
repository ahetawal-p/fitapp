angular.module('app.utils')

.factory('iconUtil', function() {
	var iconDictionary = {};
	iconDictionary["run"] = "img/icon-walk-32.png";
	iconDictionary["walk"] = "img/icon-run-32.png";

    function getIcon(activityType){
  		var icon = iconDictionary[activityType];
      return icon;
    }

  return {
    getIcon: getIcon
  };
});