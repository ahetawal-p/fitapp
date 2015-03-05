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

        	var averages = {
	        	weekdayAverage: "25 minutes",
	        	weekendAverage: "40 minutes"
            };

        	deferred.resolve(averages);

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
				saveWorkouts: function(){
					$cordovaHealthKit.saveWorkout(
					{
						'activityType': 'HKWorkoutActivityTypeCycling',
						'quantityType': 'HKQuantityTypeIdentifierDistanceCycling',
			            'startDate': new Date(), // now
			            'endDate': null, // not needed when using duration
			            'duration': 6000, //in seconds
			            'energy': 400, //
			            'energyUnit': 'kcal', // J|cal|kcal
			            'distance': 5, // optional
			            'distanceUnit': 'km'
			        }
			        ).then(function(v) {
			        //alert(JSON.stringify(v));
			    }, function(err) {
			    	console.log(err);
			    });
			    }
			}}]
			);