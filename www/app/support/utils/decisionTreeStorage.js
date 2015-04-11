angular.module('app.utils')

.factory('decisionTreeStorage', function() {
	var weekdayOrWeekendActive,
		mostActiveTimeOfDay;

  return {
    weekdayOrWeekendActive: weekdayOrWeekendActive,
    mostActiveTimeOfDay: mostActiveTimeOfDay
  };
});