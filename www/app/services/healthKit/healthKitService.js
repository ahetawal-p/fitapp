angular.module('app.services.healthKit')

.factory('healthKitService', ['healthKitApi', 'workoutProcessor', '$q',
	function(healthKitApi, workoutProcessor, $q) {

        function getActivities(){
        	var deferred = $q.defer();
        	healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var processedActivities = workoutProcessor.processWorkouts(walkRunActivities);
        		deferred.resolve(processedActivities);
        	});
        	return deferred.promise;
        }


        function getWeekdayWeekendAverages(){
        	var deferred = $q.defer();
        	healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
                var dataPoints = workoutProcessor.getAverageActivityDataPoints(startDateTime, endDateTime, walkRunActivities);
        		deferred.resolve(weekdayWeekendAverages);
        	});
        	return deferred.promise;
        	// var averages = {
	        // 	weekdayAverage: "25 seconds",
	        // 	weekendAverage: "40 seconds"
         //    };

        }

        function getWeekdayTimesOfDayAverages(){
            var deferred = $q.defer();

            healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
                
            function weekdayFilter(rawActivityObject){
                var rawActivityDateObj = new Date(rawActivityObject.startDate.replace(/-/g, "/"));
                var isWeekday = rawActivityDateObj.getDay() > 0 && rawActivityDateObj.getDay() < 6;

                return isWeekday;
            }

                var morningStartDateTime = new Date("1/1/1900 05:00");
                var morningEndDateTime = new Date("1/1/1900 12:00");
                var weekdayMorningAverage = workoutProcessor.getAverageActivityDuration(morningStartDateTime, morningEndDateTime, walkRunActivities, weekdayFilter);
                
                var afternoonStartDateTime = new Date("1/1/1900 12:00");
                var afternoonEndDateTime = new Date("1/1/1900 17:00");
                var weekdayAfternoonAverage = workoutProcessor.getAverageActivityDuration(afternoonStartDateTime, afternoonEndDateTime, walkRunActivities, weekdayFilter);
                
                var eveningStartDateTime = new Date("1/1/1900 17:00");
                var eveningEndDateTime = new Date("1/1/1900 23:59");
                var weekdayEveningAverage = workoutProcessor.getAverageActivityDuration(eveningStartDateTime, eveningEndDateTime, walkRunActivities, weekdayFilter);
                
                var timesOfDayAverages = {
                    "morning": weekdayMorningAverage,
                    "afternoon": weekdayAfternoonAverage,
                    "evening": weekdayEveningAverage
                };

                console.log(JSON.stringify(timesOfDayAverages));

                deferred.resolve(timesOfDayAverages);
            });

            return deferred.promise;
        }

        function getAverageActivityDataPoints(startDateTime, endDateTime){
			var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var dataPoints = workoutProcessor.getAverageActivityDataPoints(startDateTime, endDateTime, walkRunActivities);
        		deferred.resolve(dataPoints);
        	});

        	return deferred.promise;
        }

        function getActivityDataPoints(startDateTime, endDateTime){
        	var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistanceByDateTime(startDateTime, endDateTime).then(function(walkRunActivities){
        		var dataPoints = workoutProcessor.getActivityDataPoints(startDateTime, endDateTime, walkRunActivities);
        		console.log("data points: " + JSON.stringify(dataPoints));
        		deferred.resolve(dataPoints);
        	});

        	return deferred.promise;
        }

        //calc avg over N days (depends on what data has)
        function getDailyAverageDuration(){
			var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var total = workoutProcessor.calculateDailyAverageDuration(walkRunActivities);
        		console.log("avg duration: " + total);
        		deferred.resolve(total);
        	});

        	return deferred.promise;
        }

        function getTodaysDurationSum(){
        	var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var total = workoutProcessor.calculateTodaysTotalDuration(walkRunActivities);
        		deferred.resolve(total);
        	});

        	return deferred.promise;
        }

        function getMostRecentActivity(){
        	var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var processedActivities = workoutProcessor.processWorkouts(walkRunActivities);
        		var mostRecentActivity = processedActivities[0];
        		console.log("most recent: " + JSON.stringify(mostRecentActivity));
        		deferred.resolve(mostRecentActivity);
        	});

        	return deferred.promise;
        }

			return {
				getActivities: getActivities,
				getWeekdayWeekendAverages: getWeekdayWeekendAverages,
				getDailyAverageDuration: getDailyAverageDuration,
				getTodaysDurationSum: getTodaysDurationSum,
				getMostRecentActivity: getMostRecentActivity,
				getActivityDataPoints: getActivityDataPoints,
				getAverageActivityDataPoints: getAverageActivityDataPoints,
                getWeekdayTimesOfDayAverages: getWeekdayTimesOfDayAverages
			}}]
			);