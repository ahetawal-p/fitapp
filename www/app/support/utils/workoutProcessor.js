angular.module('app.utils')

.factory('workoutProcessor', ['activityTypeUtil', 'dateTimeUtil', 'iconUtil', 'groupedActivityBuilder' ,
	function(activityTypeUtil, dateTimeUtil, iconUtil, groupedActivityBuilder) {

	function processWorkouts(rawActivityObjects){
				console.log("########################");
		console.log("length: " + rawActivityObjects.length);
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		var processedActivities = [];
		for (var ii=0; ii<groupedActivities.length; ii++){
			var groupedActivity = groupedActivities[ii];
			var calories = calculateCalories(groupedActivity);
			console.log("groupedStartdate: " + groupedActivity.startDate);
			var durationString = dateTimeUtil.getDurationString(groupedActivity.startDate, groupedActivity.endDate);
			var distanceString = groupedActivity.distance.toFixed(2) + " km";
			var description = distanceString + ", " + calories + " cal";
			var date = dateTimeUtil.getFormattedDateString(groupedActivity.startDate);
			var timeStamp = dateTimeUtil.getTimeStamp(groupedActivity.startDate);
			processedActivities.push({
				timeStamp: timeStamp,
				date: date,
				description: description,
				duration: durationString,
				activityType: "walk",
				icon: "ion-fireball"
			});
		}

		return processedActivities;
	}

	function groupActivities(rawActivityObjects){
		var groupedActivities = [];
		for (var ii=0;ii<rawActivityObjects.length;ii++){
			var rawActivityObject = rawActivityObjects[ii];

			if (ii == 0){
				var timeStamp = dateTimeUtil.getTimeStamp(rawActivityObject.startDate);	
				console.log("beginning timestamp: " + timeStamp);
				groupedActivityBuilder.createGroupedActivity(rawActivityObject.startDate);
			}

			var workoutStartDate = new Date(rawActivityObject.startDate.replace(/-/g, "/"));

			var nextWorkout = rawActivityObjects[ii + 1];
			if (nextWorkout == null){
				groupedActivities.push(groupedActivityBuilder.getGroupedActivity(rawActivityObject.endDate));
			}
			else{
				var nextWorkoutStartDateString = nextWorkout.startDate.replace(/-/g, "/");
				var nextWorkoutStartDate = new Date(nextWorkoutStartDateString);
				var timeDiff = Math.abs(nextWorkoutStartDate - workoutStartDate);
				var timeDiffInMins = Math.floor((timeDiff/1000)/60);
				console.log("time diff: " + timeDiffInMins);
				if (timeDiffInMins > 1){
					groupedActivities.push(groupedActivityBuilder.getGroupedActivity(rawActivityObject.endDate));
					groupedActivityBuilder.clearGroupedActivity();
					groupedActivityBuilder.createGroupedActivity(nextWorkout.startDate);
				}else{
					groupedActivityBuilder.addDistance(rawActivityObject.quantity);
				}
			}


		}

		return groupedActivities;
	}

	function filterGroupedActivities(rawActivityObjects){

	}

	function calculateCalories(groupedActivity){
		//CB = [0.0215 x KPH3 - 0.1765 x KPH2 + 0.8710 x KPH + 1.4577] x WKG x T
		//assume weight is 60kg
		console.log("calories end date: " + groupedActivity.endDate);
				console.log("calories start date: " + groupedActivity.startDate);

		var durationInHours = dateTimeUtil.getDurationInHours(groupedActivity.startDate, groupedActivity.endDate)
		console.log("durationInHours: " + durationInHours);
		var kph = groupedActivity.distance/durationInHours;
		console.log("kph: " + kph);
		var weight = 60;
		var calories = (0.0215 * Math.pow(kph, 3) - 0.1765 * Math.pow(kph, 2) 
						+ 0.8710 * kph + 1.4577) * weight * durationInHours;
		console.log("calories: " + calories);
		console.log("distance: " + groupedActivity.quantity);
		var roundedCalories = Math.ceil(calories);
		return roundedCalories;
	}

	return {
		processWorkouts: processWorkouts
	}
}]);