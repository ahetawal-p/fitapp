angular.module('app.factories')

.factory('healthKitQueryFactory',['dateTimeUtil', 'healthKitService', 'chartConfigFactory', '$q', 
    function(dateTimeUtil, healthKitService, chartConfigFactory, $q) {

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

	var getLastPreviousWeeksAvgerageChart = function(){
		var deferred = $q.defer();
		healthKitService.getLastVsPreviousWeekAverage().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", "Average minutes of activity", "Last week", "2 weeks ago");
				deferred.resolve(chartConfig);
			},
			function(error){
				deferred.reject(error);
			});

		return deferred.promise;
	}

	var getDailyAverageVsUsersChart = function(){
		var deferred = $q.defer();
		healthKitService.getDailyAverageVsAllUsers().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", "Average minutes active per day", "You", "Other users");
				deferred.resolve(chartConfig);
			},
			function(error){
				deferred.reject(error);
			});

		return deferred.promise;
	}

        return {
            getTodayVsAverageChartConfig: getTodayVsAverageChartConfig,
            getLastPreviousWeeksAvgerageChart: getLastPreviousWeeksAvgerageChart,
            getDailyAverageVsUsersChart: getDailyAverageVsUsersChart
        };
    }]);