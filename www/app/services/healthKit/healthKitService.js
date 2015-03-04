angular.module('app.healthKit')

.factory('healthKitService', ['healthKitApi', 'workoutProcessor', '$q',
	function(healthKitApi, workoutProcessor, $q) {

		var workoutObjects = [];
		function getWorkouts(){
        	//clear workout objects
        	workoutObjects.length = 0;
        	var deferred = $q.defer();
        	healthKitApi.getWorkouts().then(processWorkouts);
        	deferred.resolve(workoutObjects);

        	return deferred.promise;
        }

        function getActivities(){
        	var deferred = $q.defer();
        	healthKitApi.getWalkingAndRunningDistance().then(function(walkRunActivities){
    //     		var processedActivities = [];
				// for (var ii=0; ii<walkRunActivities.length; ii++){
				// 	var walkRunActivity = walkRunActivities[ii];
				// 	var processedActivity = workoutProcessor.processWorkout(walkRunActivity);

				// 	processedActivities.push(processedActivity);
				// }
				var processedActivities = workoutProcessor.processWorkouts(walkRunActivities);
				console.log("processed activities: " + JSON.stringify(processedActivities));

        		deferred.resolve(processedActivities);
        	});
        	return deferred.promise;
        }

        function sortByStartDate(workoutA, workoutB){
        	var workoutADateString = workoutA.date + "  "+ workoutA.timeStamp;
        	var workoutBDateString = workoutB.date + "  "+ workoutB.timeStamp;
        	console.log("sort: " + workoutADateString);
        	var workoutADate = new Date(workoutADateString.replace(/-/g, "/"));
        	var workoutBDate = new Date(workoutBDateString.replace(/-/g, "/"));

        	return workoutBDate - workoutADate;
        }

        function processWorkouts(rawWorkoutObjects){
				//sort raw workout objects first
				//rawWorkoutObjects.sort(sortByStartDate);
				console.log("raw: "+JSON.stringify(rawWorkoutObjects));
				for (var ii=0; ii<rawWorkoutObjects.length; ii++)
					(function(ii){
						var rawWorkoutObject = rawWorkoutObjects[ii];
						var processedWorkout = workoutProcessor.processWorkout(rawWorkoutObject);
						var response = healthKitApi.getWorkoutDistanceAndCalories(rawWorkoutObject).then(function(distanceCaloriesObject){
							console.log("got distance/calories: " + JSON.stringify(distanceCaloriesObject));
							var caloriesString = distanceCaloriesObject.calories.toString().concat(" kcal");
							var distanceString = distanceCaloriesObject.distance.toString().concat(" km");
							processedWorkout.description = distanceString.concat(" ").concat(caloriesString);
							console.log("workoutObj: "+ JSON.stringify(processedWorkout));
							workoutObjects.push(processedWorkout);
							workoutObjects.sort(sortByStartDate);
						});

					// var response = healthKitApi.getWorkoutDistance(rawWorkoutObject).then(function(workoutDistanceObject){
					// 	healthKitApi.getWorkoutCalories(workoutDistanceObject);
					// })
					// 			.then(function(workoutDistanceObject){
					// 				console.log("workoutD: " + JSON.stringify(workoutDistanceObject));


					// 			})
					// 			;

				})(ii);
			}

			return {
				getWorkouts: getWorkouts,
				getActivities: getActivities,
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