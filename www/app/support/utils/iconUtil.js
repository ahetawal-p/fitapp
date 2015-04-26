angular.module('app.utils')

.factory('iconUtil', function() {
	var iconDictionary = {};
	iconDictionary["Activity_Type_Run"] = "img/icon-run-32.png";
	iconDictionary["Activity_Type_Walk"] = "img/icon-walk-32.png";

    function getIcon(activityType){
  		var icon = iconDictionary[activityType];
      //console.log(icon);
      return icon;
    }

  return {
    getIcon: getIcon
  };
});