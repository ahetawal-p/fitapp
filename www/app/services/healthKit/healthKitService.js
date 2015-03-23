angular.module('app.services.healthKit')

.factory('healthKitService', ['healthKitApi', 'healthKitStubApi', 'workoutProcessor', '$q', '$rootScope',
	function(healthKitApi, healthKitStubApi, workoutProcessor, $q, $rootScope) {
        var api = {};

        if ($rootScope.healthkitExists){
            api = healthKitApi;
        }else{
            api = healthKitStubApi;
        }

        //api = healthKitStubApi;

        function getActivities(){
        	var deferred = $q.defer();
        	api.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var processedActivities = workoutProcessor.processWorkouts(walkRunActivities);
        		deferred.resolve(processedActivities);
        	});
        	return deferred.promise;
        }


        function getWeekdayWeekendAverages(){
        	var deferred = $q.defer();
        	api.getWalkingAndRunningDistance().then(function(walkRunActivities){
                var weekdayWeekendAverages = workoutProcessor.calculateWeekdayWeekendAverages(walkRunActivities);
        		deferred.resolve(weekdayWeekendAverages);
        	});
        	return deferred.promise;
        }

        function getWeekdayTimesOfDayAverages(){
            var deferred = $q.defer();

            api.getWalkingAndRunningDistance().then(function(walkRunActivities){
                
                function weekdayFilter(rawActivityObject){
                    var rawActivityDateObj = new Date(rawActivityObject.startDate.replace(/-/g, "/"));
                    var isWeekday = rawActivityDateObj.getDay() > 0 && rawActivityDateObj.getDay() < 6;

                    return isWeekday;
                }

                var timesOfDayAverages = getTimesOfDayAverages(walkRunActivities, weekdayFilter);
                console.log(JSON.stringify(timesOfDayAverages));

                deferred.resolve(timesOfDayAverages);
            });

            return deferred.promise;
        }

        function getWeekendTimesOfDayAverages(){
            var deferred = $q.defer();

            api.getWalkingAndRunningDistance().then(function(walkRunActivities){
                
                function weekdayFilter(rawActivityObject){
                    var rawActivityDateObj = new Date(rawActivityObject.startDate.replace(/-/g, "/"));
                    var isWeekday = rawActivityDateObj.getDay() > 0 && rawActivityDateObj.getDay() < 6;

                    return !isWeekday;
                }

                var timesOfDayAverages = getTimesOfDayAverages(walkRunActivities, weekdayFilter);
                console.log(JSON.stringify(timesOfDayAverages));

                deferred.resolve(timesOfDayAverages);
            });

            return deferred.promise;
        }

        function getTimesOfDayAverages(rawActivityObjects, filterFunction){
            var morningStartDateTime = new Date("1/1/1900 05:00");
            var morningEndDateTime = new Date("1/1/1900 12:00");
            var weekdayMorningAverage = workoutProcessor.getAverageActivityDuration(morningStartDateTime, morningEndDateTime, rawActivityObjects, filterFunction);
            
            var afternoonStartDateTime = new Date("1/1/1900 12:00");
            var afternoonEndDateTime = new Date("1/1/1900 17:00");
            var weekdayAfternoonAverage = workoutProcessor.getAverageActivityDuration(afternoonStartDateTime, afternoonEndDateTime, rawActivityObjects, filterFunction);
            
            var eveningStartDateTime = new Date("1/1/1900 17:00");
            var eveningEndDateTime = new Date("1/1/1900 23:59");
            var weekdayEveningAverage = workoutProcessor.getAverageActivityDuration(eveningStartDateTime, eveningEndDateTime, rawActivityObjects, filterFunction);
            
            var timesOfDayAverages = {
                "morning": weekdayMorningAverage,
                "afternoon": weekdayAfternoonAverage,
                "evening": weekdayEveningAverage
            };

            return timesOfDayAverages;
        }

        /* get today's data points vs average */
        function getTodayVsAverageDataPoints(startDateTime, endDateTime){
            var deferred = $q.defer();
            var labels = [];
            var data = [];
            getActivityDataPoints(startDateTime, endDateTime).then(function(response){
                labels = response.times;
                console.log("response durations: " + response.durations);
                data.push(response.durations);

            })
            .then(function(){
                return getAverageActivityDataPoints(startDateTime, endDateTime);
            })
            .then(function(response){
                data.push(response.durations);
                var plot = {
                    labels: labels,
                    data: data
                };

                deferred.resolve(plot);
            });

            return deferred.promise;
        }

        function getAverageActivityDataPoints(startDateTime, endDateTime){
			var deferred = $q.defer();
			api.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var dataPoints = workoutProcessor.getAverageActivityDataPoints(startDateTime, endDateTime, walkRunActivities);
                var times = [];
                var durations = [];
                var index = 0;
                _.each(dataPoints, function(dataPoint){
                    if (index == 0){
                        times.push(dataPoint.time);
                    }else if (index == dataPoints.length-1){
                        times.push("Now");
                    }else{
                        times.push("");
                    }

                    durations.push(dataPoint.averageDuration);
                    index ++;
                });
                var dataPointsObject = {
                    times: times,
                    durations: durations
                };
                deferred.resolve(dataPointsObject);
        	});

        	return deferred.promise;
        }



        function getActivityDataPoints(startDateTime, endDateTime){
        	var deferred = $q.defer();
			api.getWalkingAndRunningDistanceByDateTime(startDateTime, endDateTime).then(function(walkRunActivities){
        		
                var dataPoints = workoutProcessor.getActivityDataPoints(startDateTime, endDateTime, walkRunActivities);

                var times = [];
                var durations = [];
                var index = 0;
                _.each(dataPoints, function(dataPoint){
                    if (index == 0){
                        times.push(dataPoint.dateTime);
                    }else if (index == dataPoints.length-1){
                        times.push("Now");
                    }else{
                        times.push("");
                    }
                    durations.push(dataPoint.durationTillNow);
                    index ++;
                });

                var dataPointsObject = {
                    times: times,
                    durations: durations
                };
                deferred.resolve(dataPointsObject);
        	});

        	return deferred.promise;
        }

        function getDailyAverageVsAllUsers(){
            var deferred = $q.defer();
            getDailyAverageDuration().then(function(response){
                var labels = ["You", "Other users"];
                var data = [[response], [50]];
                var plotNumbers = {
                    labels: labels,
                    data: data
                };

                deferred.resolve(plotNumbers);
            });

            return deferred.promise;
        }

        //calc avg over N days (depends on what data has)
        function getDailyAverageDuration(){
			var deferred = $q.defer();
			api.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var total = workoutProcessor.calculateDailyAverageDuration(walkRunActivities);
        		console.log("avg duration: " + total);
        		deferred.resolve(total);
        	});

        	return deferred.promise;
        }

        function getTodaysDurationSum(){
        	var deferred = $q.defer();
			api.getWalkingAndRunningDistance().then(function(walkRunActivities){
        		var total = workoutProcessor.calculateTodaysTotalDuration(walkRunActivities);
        		deferred.resolve(total);
        	});

        	return deferred.promise;
        }

        function getMostRecentActivity(){
        	var deferred = $q.defer();
			api.getWalkingAndRunningDistance().then(function(walkRunActivities){
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
                getWeekdayTimesOfDayAverages: getWeekdayTimesOfDayAverages,
                getWeekendTimesOfDayAverages: getWeekendTimesOfDayAverages,
                getTodayVsAverageDataPoints: getTodayVsAverageDataPoints,
                getDailyAverageVsAllUsers: getDailyAverageVsAllUsers
			}}]
			);