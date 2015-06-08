angular.module('app.services.push')

.factory('pushTextService', ['$q', 'healthKitService', '$translate',
	function($q, healthKitService, $translate) {

		function getTodaysActivityDurationText(){
			var deferred = $q.defer();
			var translatedText = $translate.instant("136");
			healthKitService.getTodaysDurationSum().then(function(response){
				var totalSum = response;
				var replaced = translatedText.replace("$$", totalSum);
				deferred.resolve(replaced);
			});
			return deferred.promise;
		}

		return {
			getTodaysActivityDurationText: getTodaysActivityDurationText
		}
	}]
	);