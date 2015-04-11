angular.module('app.factories')

.factory('healthKitQueryFactory',['dateTimeUtil', 'healthKitService', 'chartConfigFactory', '$q', 
    function(dateTimeUtil, healthKitService, chartConfigFactory, $q) {

	var getTodayVsAverageChartConfig = function(type) {
		console.log("Running data here...");

		var deferred = $q.defer();
		var startDate = moment();
		startDate.hours(0);
		startDate.minutes(0);

		var endDate = moment();

		healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(
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

	var getYesterdayVsAverageChartConfig = function(type) {
		console.log("Running data here...");

		var deferred = $q.defer();
		var startDate = moment();
		startDate.add(-1, 'days');
		startDate.hours(0);
		startDate.minutes(0);

		var endDate = moment();
		endDate.add(-1, 'days');
		endDate.hours(23);
		endDate.minutes(59);

		healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "line", "Activity Yesterday");
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

	var getAverageMinutesADay = function(){
		return healthKitService.getDailyAverageDuration();
	}

	var getWeekdayVsWeekendChart = function() {
		var deferred = $q.defer();
		healthKitService.getWeekdayWeekendAverages().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", "Weekday vs Weekend", "Weekday", "Weekend");
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
            getDailyAverageVsUsersChart: getDailyAverageVsUsersChart,
            getYesterdayVsAverageChartConfig: getYesterdayVsAverageChartConfig,
            getWeekdayVsWeekendChart: getWeekdayVsWeekendChart,
            getAverageMinutesADay: getAverageMinutesADay
        };
    }]);