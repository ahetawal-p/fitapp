angular.module('app.utils')

.factory('commonFunc', [
	'healthKitService', 
	'$q', 
	'$ionicPlatform', 
	'chartConfigFactory', 
	'$ionicPopup', 
	'$localstorage', 
	'$translate', 
	'healthKitQueryFactory',
	'dateTimeUtil',
	function(healthKitService, 
			$q, 
			$ionicPlatform, 
			chartConfigFactory, 
			$ionicPopup, 
			$localstorage, 
			$translate, 
			healthKitQueryFactory,
			dateTimeUtil) {



		var calculateAverageMinsPerDay = function(currentNode){
			var deferred = $q.defer();
			healthKitService.getDailyAverageDuration().then(function(minutes){
			// TODO : Will add randomization later if required.
				$translate(currentNode.text[0]).then(function (translated){
					var replaced = translated.replace("$$", minutes);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
			});

			return deferred.promise;
		};


		var calculateYearsToMoon = function(currentNode){
			var deferred = $q.defer();
			healthKitService.getDailyAverageDuration().then(function(minutes){
			// TODO : Will add randomization later if required.
				$translate(currentNode.text[0]).then(function (translated){
					var distanceToMoon = 384400;
					var avgWalkSpeed = 5;
					/* years to moon = distance / (hours/day x km/hours)/365 */
					var yearsToMoon = Math.round(384400/(minutes/60 * 5)/365);
					var replaced = translated.replace("$$", yearsToMoon);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
			});

			return deferred.promise;
	};

	

	var calculatePercentOnButt = function (currentNode){
		var deferred = $q.defer();

		healthKitService.getDailyAverageDuration().then(function(minutes){
			if (!minutes){
				minutes = 0;
			}

			$translate(currentNode.text[0]).then(function (translated){
				var totalMinutesADay = 24 * 60;
				var totalMinutesOnButt = totalMinutesADay - minutes;
				var percentOnButt = Math.round(totalMinutesOnButt/totalMinutesADay * 100);
				var replaced = translated.replace("$$", percentOnButt);
				currentNode.text = replaced;
				currentNode.type = null;
				deferred.resolve(currentNode);
			});
		});

		return deferred.promise;
	}

	


	var mostActiveTimeOfWeekDuration = function(currentNode){
		var deferred = $q.defer();

		healthKitService.getMostActiveTimeOfWeek().then(function(response){
				$translate(currentNode.text[0]).then(function (translated){
					var weekdayOrWeekend = response.timeOfWeek;
					var timeOfDay = response.timeOfDay;
					var replaced = translated.replace("$$", response.duration);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
		});

		return deferred.promise;	
	}

	var powerHour = function(currentNode){
		var deferred = $q.defer();

		healthKitService.getMostActiveTimeOfWeek().then(function(response){
				$translate(currentNode.text[0]).then(function (translated){
					var timeOfDay = response.timeOfDay;
					var replaced = translated.replace("$$", timeOfDay);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
		});

		return deferred.promise;	
	}

	var mostActiveTimeOfWeek = function(currentNode){
		var deferred = $q.defer();

		healthKitService.getMostActiveTimeOfWeek().then(function(response){
				$translate(currentNode.text[0]).then(function (translated){
					var weekdayOrWeekend = response.timeOfWeek;
					var timeOfDay = response.timeOfDay;
					var replaced = translated.replace("$$", weekdayOrWeekend);
					replaced = replaced.replace("%%", timeOfDay);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
		});

		return deferred.promise;
	}


	var loggedInTimeSoFar = function(currentNode){
		var deferred = $q.defer();

		healthKitService.getMostRecentActivity().then(function(response){
				$translate(currentNode.text[0]).then(function (translated){
					var weekdayOrWeekend = response.timeOfWeek;
					var timeOfDay = response.timeOfDay;
					var replaced = translated.replace("$$", weekdayOrWeekend);
					replaced = replaced.replace("%%", timeOfDay);
					currentNode.text = replaced;
					currentNode.type = null;
					deferred.resolve(currentNode);
				});
		});

		return deferred.promise;

	}



	return {

		calculateAverageMinsPerDay 	: calculateAverageMinsPerDay,
		calculateYearsToMoon		: calculateYearsToMoon,
		calculatePercentOnButt		: calculatePercentOnButt,
		mostActiveTimeOfWeekDuration: mostActiveTimeOfWeekDuration,
		powerHour					: powerHour,
		mostActiveTimeOfWeek 		: mostActiveTimeOfWeek,
		loggedInTimeSoFar			: loggedInTimeSoFar

	}











	}]);