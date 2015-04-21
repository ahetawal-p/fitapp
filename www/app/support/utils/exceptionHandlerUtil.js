angular.module('app.utils')

.factory('exceptionHandlerUtil', ['$translate', function($translate) {
	var workoutDictionary = {};

  /* avg running speed is 6m/h = 0.00268 km/sec */
  function healthKitNotExistErrorHandler(error){
    console.log(error);
    var alertMessage = $translate.instant("52");
    alert(alertMessage);
  }

  return {
    healthKitNotExistErrorHandler: healthKitNotExistErrorHandler
  }
}]);