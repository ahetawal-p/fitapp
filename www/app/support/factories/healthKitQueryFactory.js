angular.module('app.factories')

.factory('healthKitQueryFactory',['dateTimeUtil', 'healthKitService', 'chartConfigFactory', '$q', '$translate',
    function(dateTimeUtil, healthKitService, chartConfigFactory, $q, $translate) {

	var getTodayVsAverageChartConfig = function(type) {
		console.log("Running data here...");
		var activityTodayText = $translate.instant("Activity_Today");
		var deferred = $q.defer();
		var startDate = moment();
		startDate.hours(0);
		startDate.minutes(0);

		var endDate = moment();

		healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "line", activityTodayText);
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
		var activityYesterdayText = $translate.instant("Activity_Yesterday");
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
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "line", activityYesterdayText);
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
		var averageMinutesOfActivityText = $translate.instant("Average_Minutes_Of_Activity");
		var lastWeekText = $translate.instant("Last_Week");
		var twoWeeksAgoText = $translate.instant("Two_Weeks_Ago");
		healthKitService.getLastVsPreviousWeekAverage().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", averageMinutesOfActivityText, lastWeekText, twoWeeksAgoText);
				deferred.resolve(chartConfig);
			},
			function(error){
				deferred.reject(error);
			});

		return deferred.promise;
	}

	var getDailyAverageVsUsersChart = function(){
		var deferred = $q.defer();
		var averageMinutesActivePerDayText = $translate.instant("Average_Minutes_Active_Per_Day");
		var youText = $translate.instant("You");
		var otherUsersText = $translate.instant("Other_Users");
		healthKitService.getDailyAverageVsAllUsers().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", averageMinutesActivePerDayText, youText, otherUsersText);
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
		var weekdayVsWeekendText = $translate.instant("Weekday_Vs_Weekend");
		var weekdayText = $translate.instant("weekday");
		var weekendText = $translate.instant("weekend");
		healthKitService.getWeekdayWeekendAverages().then(
			function(response){
				var chartConfig = chartConfigFactory.createConversationChartConfig(response, "bar", weekdayVsWeekendText, weekdayText, weekendText);
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