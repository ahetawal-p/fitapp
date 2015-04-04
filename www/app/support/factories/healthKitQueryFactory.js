angular.module('app.factories')

.factory('healthKitQueryFactory',['dateTimeUtil', 'healthKitService', '$q', 'chartConfigFactory',
    function(dateTimeUtil, healthKitService, $q, chartConfigFactory) {

	var getTodayVsAverageChartConfig = function(type) {
		console.log("Running data here...");

		var deferred = $q.defer();
		var startDate = new Date();
		startDate.setHours(0);
		startDate.setMinutes(0);

		var endDate = new Date();

		healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "line", "Activity Today");
				deferred.resolve(chartConfig);
			},
			function(error){
				deferred.reject(error);
			}
		);
		console.log("1 Running data here...");
		
        return deferred.promise;
	};


        return {
            getTodayVsAverageChartConfig: getTodayVsAverageChartConfig
        };
    }]);