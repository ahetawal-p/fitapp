angular.module('app.utils')

.factory('workoutProcessor', ['activityTypeUtil', 'dateTimeUtil', 'iconUtil', 'groupedActivityBuilder', '_',
	function(activityTypeUtil, dateTimeUtil, iconUtil, groupedActivityBuilder, _) {

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

	function getAverageActivityDuration(startDateTime, endDateTime, rawActivityObjects, filterFunction){
		//pre filter rawActivityObjects, potentially by weekend or weekday
		rawActivityObjects = rawActivityObjects.filter(filterFunction);

		var totalUniqueDays = _.uniq(rawActivityObjects, function(activityObj){
			var activityDate = new Date(activityObj.startDate.replace(/-/g, "/"));
			var dateString = activityDate.getMonth()+1 + "/" + activityDate.getDate();
			return dateString;
		});	

		//get sum of duration of rawActivityObjects in given time
		var totalDuration = getTotalDurationBetweenDateTimes(startDateTime, endDateTime, rawActivityObjects);
		console.log("unique Days: " + totalUniqueDays.length);
		if (totalUniqueDays == null || totalUniqueDays.length == 0){
			return 0;
		}

		return totalDuration/totalUniqueDays.length;
	} 

	/* specify startTime and endTime, and get average activity durations for time slots in between
		can use filterFunction to pass in filter criteria, ex. weekday, weekend */
	function getAverageActivityDataPoints(startDateTime, endDateTime, rawActivityObjects, filterFunction){
		
		//group raw activities by time 
		var increment = 30;
		var iterDateTime = startDateTime;
		var activityAverages = [];

		/* need number of unique days accross ALL data points in ALL time buckets
			, not just all data points within a certain time bucket. Might have activity
			at 7pm on Monday but not Tuesday, but need to include both days to calc 
			average activity duration at 7pm
		*/
		var totalUniqueDays = _.uniq(rawActivityObjects, function(activityObj){
			var activityDate = new Date(activityObj.startDate.replace(/-/g, "/"));
			var dateString = activityDate.getMonth()+1 + "/" + activityDate.getDate();
			return dateString;
		});

		var numUniqueDays = totalUniqueDays.length;
		while (dateTimeUtil.secondTimeGreaterThanFirst(iterDateTime, endDateTime)){
			var activitiesInRange = getRawActivitiesBeforeDateTime(iterDateTime, rawActivityObjects);

			//apply additional filters if any (i.e. weekday or weekend)
			if (filterFunction == null){}
			else{
				activitiesInRange = _.filter(activitiesInRange, filterFunction);
			}
			var timeString = (iterDateTime.getHours() < 10? '0': '') + iterDateTime.getHours() + ":" + (iterDateTime.getMinutes() < 10 ? '0': '') + iterDateTime.getMinutes();

			activityAverages.push({
				"time": timeString,
				"averageDuration": calculateAverageDurationPerDay(activitiesInRange, numUniqueDays)
			});

			//increment iterDateTime by set interval
			iterDateTime = new Date(iterDateTime.getTime() + increment*60000);
		}

		return activityAverages;
	}

	//get activities between two times of day of given datetimes
	function getTotalDurationBetweenDateTimes(startDateTime, endDateTime, rawActivityObjects){
		var activitiesInRange = _.filter(rawActivityObjects, function(rawActivityObject){
			var rawActivityDateTime = new Date(rawActivityObject.startDate.replace(/-/g, "/"));

			var afterStartTime = dateTimeUtil.secondTimeGreaterThanFirst(startDateTime, rawActivityDateTime);
			var beforeEndTime = dateTimeUtil.secondTimeGreaterThanFirst(rawActivityDateTime, endDateTime);

			return afterStartTime && beforeEndTime;
		});

		var totalDuration = 0;
			_.each(activitiesInRange, function(activityInRange){
				var activityDuration = dateTimeUtil.getDurationInSeconds(activityInRange.startDate, activityInRange.endDate);
				totalDuration += activityDuration;
			});


		return totalDuration;
	}


	//get activities before the time of day of given datetime
	function getRawActivitiesBeforeDateTime(dateTime, rawActivityObjects){
		var activitiesInRange = _.filter(rawActivityObjects, function(rawActivityObject){
			var rawActivityDateTime = new Date(rawActivityObject.startDate.replace(/-/g, "/"));

			var beforeIterTime = dateTimeUtil.secondTimeGreaterThanFirst(rawActivityDateTime, dateTime);
			return beforeIterTime;
		});

		return activitiesInRange;
	}

	//feed in activities from different dates, calculate average duration per day
	function calculateAverageDurationPerDay(rawActivityObjects, numUniqueDays){
		// iterate thru activities, sum up durations, and count days
		var durationSum = 0;
		for(var ii=0; ii<rawActivityObjects.length; ii++){
			var rawActivityObject = rawActivityObjects[ii];
			var activityDuration = dateTimeUtil.getDurationInSeconds(rawActivityObject.startDate, rawActivityObject.endDate);
			var activityDate = new Date(rawActivityObject.startDate.replace(/-/g, "/"));
			var dateString = activityDate.getMonth()+1 + "/" + activityDate.getDate();
			durationSum += activityDuration;
		}

		if (numUniqueDays == 0){
			return 0;
		}

		return durationSum/numUniqueDays;
	}

	// get activity data points in seconds
	function getActivityDataPoints(startDateTime, endDateTime, rawActivityObjects){
		var iterDateTime = startDateTime;
		var dataPoints = [];
		//increment by 30 minutes
		var increment = 30;
		while (iterDateTime < endDateTime){
			// get raw activities that fall bewteen startDateTime and iterDateTime
			var activitiesInRange = getRawActivitiesBeforeDateTime(iterDateTime, rawActivityObjects);

			//iterate through activities in range and sum up their durations
			var totalDuration = 0;
			_.each(activitiesInRange, function(activityInRange){
				var activityDuration = dateTimeUtil.getDurationInSeconds(activityInRange.startDate, activityInRange.endDate);
				totalDuration += activityDuration;
			});

			var timeString = (iterDateTime.getHours() < 10? '0': '') + iterDateTime.getHours() + ":" + (iterDateTime.getMinutes() < 10 ? '0': '') + iterDateTime.getMinutes();
			var dataPoint = {
				"dateTime": timeString,
				"durationTillNow": totalDuration
			};

			dataPoints.push(dataPoint);
			iterDateTime = new Date(iterDateTime.getTime() + increment*60000);

		}

		return dataPoints;
	}

	function calculateWeekdayWeekendAverages(rawActivityObjects){
		//get raw activities for weekdays and weekends
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = groupedActivities.filter(filterGroupedActivities);

		var activities = _.groupBy(groupedActivities, function(activity){
			var date = new Date(activity.startDate.replace(/-/g, "/"));
			//pretending weekend starts on thursday for testing
			if (date.getDay() > 3){
				return "weekend";
			}
			return "weekday";
		});

		//average out activities on weekdays
		var weekdayActivities = activities.weekday;
		var weekdayAverageSeconds = calculateProcessedDailyAverageDuration(weekdayActivities);
		//var weekdayAvgString = dateTimeUtil.getDurationStringFromSeconds(weekdayAverageSeconds);

		var weekendActivities = activities.weekend;
		var weekendAverageSeconds = calculateProcessedDailyAverageDuration(weekendActivities);
		//var weekendAvgString = dateTimeUtil.getDurationStringFromSeconds(weekendAverageSeconds);

		return {
			"weekdayAverage": weekdayAverageSeconds,
			"weekendAverage": weekendAverageSeconds
		}
	}

	function calculateProcessedDailyAverageDuration(groupedActivities){
		var summedDuration = 0;
		var dates = [];
		_.each(groupedActivities, function(groupedActivity){
			var durationInSeconds = dateTimeUtil.getDurationInSeconds(groupedActivity.startDate, groupedActivity.endDate);
			summedDuration += durationInSeconds;
			var monthDay = dateTimeUtil.getMonthDay(groupedActivity.startDate);
			dates.push(monthDay);
		});

		var daysCount = _.uniq(dates).length;

		console.log("sum: " + summedDuration);
		console.log("daysCount: " + daysCount);
		return summedDuration/daysCount;
	}

	function calculateDailyAverageDuration(rawActivityObjects){
		console.log("raw: "+rawActivityObjects);
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
		calculateDailyAverageDuration: calculateDailyAverageDuration,
		calculateWeekdayWeekendAverages: calculateWeekdayWeekendAverages,
		getActivityDataPoints: getActivityDataPoints,
		getAverageActivityDataPoints: getAverageActivityDataPoints,
		getAverageActivityDuration: getAverageActivityDuration,
		getTotalDurationBetweenDateTimes: getTotalDurationBetweenDateTimes,
		getAverageActivityDuration: getAverageActivityDuration
	}
}]);