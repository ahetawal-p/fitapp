angular.module('app.utils')

.factory('workoutProcessor', ['activityTypeUtil', 'dateTimeUtil', 'iconUtil', 'groupedActivityBuilder' ,
	function(activityTypeUtil, dateTimeUtil, iconUtil, groupedActivityBuilder) {

	function processWorkouts(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		//sort group activities by startDate (time)
		groupedActivities.sort(sortByStartDate);

		//filter group activities less than 0.2 km
		groupedActivities = groupedActivities.filter(filterGroupedActivities);

		var processedActivities = [];
		for (var ii=0; ii<groupedActivities.length; ii++){
			var groupedActivity = groupedActivities[ii];
			var calories = calculateCalories(groupedActivity);
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

	function calculateDailyAverageDuration(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		//calculate summed duration of all activities
		var totalDuration = 0;
		for(var ii=0; ii<groupedActivities.length; ii++){
			totalDuration += dateTimeUtil.getDurationInSeconds(groupedActivities[ii].startDate, groupedActivities[ii].endDate);
		}

		//get number of days in data
		var days = [];
		for(var ii=0; ii<groupedActivities.length; ii++){
			var groupActivityDate = new Date(groupedActivities[ii].startDate.replace(/-/g, "/"));
			days.push(groupActivityDate.getDate());
		}

		days = days.filter(function(v,i) { return i==days.lastIndexOf(v); });
		var avgSeconds = totalDuration/(days.length);
		console.log("avg duration string: " + dateTimeUtil.getDurationStringFromSeconds(avgSeconds));
		return dateTimeUtil.getDurationStringFromSeconds(avgSeconds);
	}

	function calculateTodaysTotalDuration(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		//filter by today's date
		var todaysDate = new Date().getDate();
		groupedActivities = groupedActivities.filter(function (activity){
			var activityDate = new Date(activity.startDate.replace(/-/g, "/"));
			var time24HoursAgo = new Date(new Date().getTime()-24*60*60*1000);
			return activityDate > time24HoursAgo;
		});

		var totalDuration = 0;
		for(var ii=0; ii<groupedActivities.length; ii++){
			totalDuration += dateTimeUtil.getDurationInSeconds(groupedActivities[ii].startDate, groupedActivities[ii].endDate);
		}
		console.log("total duration: " + dateTimeUtil.getDurationStringFromSeconds(totalDuration));
		return dateTimeUtil.getDurationStringFromSeconds(totalDuration);
	}

	function groupActivities(rawActivityObjects){
		var groupedActivities = [];
		for (var ii=0;ii<rawActivityObjects.length;ii++){
			var rawActivityObject = rawActivityObjects[ii];

			if (ii == 0){
				var timeStamp = dateTimeUtil.getTimeStamp(rawActivityObject.startDate);	
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

  	function sortByStartDate(workoutA, workoutB){
		var workoutADate = new Date(workoutA.startDate.replace(/-/g, "/"));
    	var workoutBDate = new Date(workoutB.startDate.replace(/-/g, "/"));

    	return workoutBDate - workoutADate;
    }

	function filterGroupedActivities(groupedActivity){
		//need to externalize the lower limit to a config
		return groupedActivity.distance > 0.2;
	}

	function calculateCalories(groupedActivity){
		//CB = [0.0215 x KPH3 - 0.1765 x KPH2 + 0.8710 x KPH + 1.4577] x WKG x T
		//assume weight is 60kg

		var durationInHours = dateTimeUtil.getDurationInHours(groupedActivity.startDate, groupedActivity.endDate)
		var kph = groupedActivity.distance/durationInHours;
		var weight = 60;
		var calories = (0.0215 * Math.pow(kph, 3) - 0.1765 * Math.pow(kph, 2) 
						+ 0.8710 * kph + 1.4577) * weight * durationInHours;
		var roundedCalories = Math.ceil(calories);
		return roundedCalories;
	}

	return {
		processWorkouts: processWorkouts,
		calculateTodaysTotalDuration: calculateTodaysTotalDuration,
		calculateDailyAverageDuration: calculateDailyAverageDuration
	}
}]);