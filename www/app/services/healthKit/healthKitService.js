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
        		var weekdayWeekendAverages = workoutProcessor.calculateWeekdayWeekendAverages(walkRunActivities);
        		deferred.resolve(weekdayWeekendAverages);
        	});
        	return deferred.promise;
        	// var averages = {
	        // 	weekdayAverage: "25 seconds",
	        // 	weekendAverage: "40 seconds"
         //    };

        }

        function getAverageActivityDataPoints(startDateTime, endDateTime){
			var deferred = $q.defer();
			healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
                console.log("calculating");
        		var dataPoints = workoutProcessor.getAverageActivityDataPoints(startDateTime, endDateTime, walkRunActivities);
        		//console.log("avg data points: " + JSON.stringify(dataPoints));
                //alert(JSON.stringify(dataPoints));
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
				getAverageActivityDataPoints: getAverageActivityDataPoints
			}}]
			);