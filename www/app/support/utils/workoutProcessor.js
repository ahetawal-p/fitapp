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

	function getActivityDurationByDate(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = groupedActivities.filter(filterGroupedActivities);
		var activitiesByDate = _.groupBy(groupedActivities, 
				function(activity){ 
					var monthDayYear = dateTimeUtil.getMonthDayYear(activity.startDate);
					return monthDayYear;
				});
		
		/* iterate through each date and sum up activities */
		var durationSumByDate = [];
		for (date in activitiesByDate){
			var activities = activitiesByDate[date];
			var durationSum = 
					activities.reduce(function(memo, activity){
						var duration = dateTimeUtil.getDurationInSeconds(activity.startDate, activity.endDate);
						return memo + duration;
					}, 0);

			durationSumByDate.push({
				durationSum: durationSum,
				date: date
			});
		}

		return durationSumByDate;
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
		var increment = 60;
		var iterDateTime = moment(startDateTime);
		var endDateTime = moment(endDateTime);
		var activityAverages = [];
		/* need number of unique days accross ALL data points in ALL time buckets
			, not just all data points within a certain time bucket. Might have activity
			at 7pm on Monday but not Tuesday, but need to include both days to calc 
			average activity duration at 7pm
		*/

		var groupedActivities = groupActivities(rawActivityObjects.reverse());
 		//filter out activities under 0.2km

		groupedActivities = groupedActivities.filter(filterGroupedActivities);
		var totalUniqueDays = _.uniq(groupedActivities, function(activityObj){
			var activityDate = new Date(activityObj.startDate.replace(/-/g, "/"));
			var dateString = activityDate.getMonth()+1 + "/" + activityDate.getDate();
			return dateString;
		});

		var numUniqueDays = totalUniqueDays.length;
		while (iterDateTime.hours() < endDateTime.hours()){
			// get raw activities that fall bewteen startDateTime and iterDateTime
			var activitiesInRange = _.filter(groupedActivities, function(groupedActivityObj){
				var groupedActivityDateTime = new Date(groupedActivityObj.startDate.replace(/-/g, "/"));
				var beforeIterTime = dateTimeUtil.secondTimeGreaterThanFirst(groupedActivityDateTime, iterDateTime);
				return beforeIterTime;
			});		

			//apply additional filters if any (i.e. weekday or weekend)
			if (filterFunction == null){}
			else{
				activitiesInRange = _.filter(activitiesInRange, filterFunction);
			}

			var timeString = iterDateTime.format("HH:MM");

			activityAverages.push({
				"time": timeString,
				"averageDuration": calculateAverageDurationPerDay(activitiesInRange, numUniqueDays)
			});

			//increment iterDateTime by set interval
			iterDateTime.add(1, "hours");
		}

		return activityAverages;
	}

	//get activities between two times of day of given datetimes
	function getTotalDurationBetweenDateTimes(startDateTime, endDateTime, rawActivityObjects){
		var activitiesInRange = _.filter(rawActivityObjects, function(rawActivityObject){
			var rawActivityDateTime = new Date(rawActivityObject.startDate.replace(/-/g, "/"));
			console.log("getTotalDurationBetweenDateTimes");
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
		var iterDateTime = moment(startDateTime);
		var dataPoints = [];
		//get grouped activities between startDateTime adn iterDateTime
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = _.filter(groupedActivities, function(activity){
			var activityDateObj = moment(activity.startDate);
			var startDateObj = moment(startDateTime);
			return activityDateObj.dayOfYear() === startDateObj.dayOfYear();
		});

		//increment by 30 minutes
		var increment = 60;
		while (iterDateTime < endDateTime){
			// get raw activities that fall bewteen startDateTime and iterDateTime
			var activitiesInRange = _.filter(groupedActivities, function(groupedActivityObj){
				var groupedActivityDateTime = new Date(groupedActivityObj.startDate.replace(/-/g, "/"));
				var beforeIterTime = dateTimeUtil.secondTimeGreaterThanFirst(groupedActivityDateTime, iterDateTime);
				return beforeIterTime;
			});		

		 	//filter out activities under 0.2km
		 	activitiesInRange = activitiesInRange.filter(filterGroupedActivities);

			//iterate through activities in range and sum up their durations
			var totalDuration = 0;
			_.each(activitiesInRange, function(activityInRange){
				var activityDuration = dateTimeUtil.getDurationInSeconds(activityInRange.startDate, activityInRange.endDate);
				totalDuration += activityDuration;
			});

			var timeString = "";

			try{
			timeString = iterDateTime.format("HH:MM");
			} catch (ex){
				var str = ex;
			};
			var dataPoint = {
				"dateTime": timeString,
				"durationTillNow": totalDuration
			};

			dataPoints.push(dataPoint);
			iterDateTime.add(1, 'hours');

		}

		return dataPoints;
	}

	function calculateWeekdayWeekendAverages(rawActivityObjects){
		//get raw activities for weekdays and weekends
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = groupedActivities.filter(filterGroupedActivities);

		var activities = _.groupBy(groupedActivities, function(activity){
			var date = moment(activity.startDate);
			//pretending weekend starts on thursday for testing
			if (date.days() == 6 || date.days() == 0){
				return "weekend";
			}
			return "weekday";
		});

		//average out activities on weekdays
		var weekdayActivities = activities.weekday;
		var weekdayAverageSeconds = calculateProcessedDailyAverageDuration(weekdayActivities);
		
		//average out activities on weekend days
		var weekendActivities = activities.weekend;
		var weekendAverageSeconds = calculateProcessedDailyAverageDuration(weekendActivities);

		return {
			"weekdayAverage": dateTimeUtil.getMinutesFromSeconds(weekdayAverageSeconds),
			"weekendAverage": dateTimeUtil.getMinutesFromSeconds(weekendAverageSeconds)
		}
	}

	/* calculate avg mins of activity for last week and previous week */
	function calculateTwoWeeksAvgMinutes(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = groupedActivities.filter(filterGroupedActivities);
		
		/* get last week's activities and calculate avg duration */
		var lastWeeksGroupedActivities = groupedActivities.filter(function(groupedActivity){
			return dateTimeUtil.isLastWeek(groupedActivity.startDate);
		});
		var lastWeeksAvgSec = calculateProcessedDailyAverageDuration(lastWeeksGroupedActivities);
		var lastWeekAvgMin = Math.round(moment.duration(lastWeeksAvgSec, 'seconds').asMinutes());
		
		/* get previous week's activities and calculate avg duration */
		var previousWeeksGroupedActivities = groupedActivities.filter(function(groupedActivity){
			return dateTimeUtil.isPreviousWeek(groupedActivity.startDate);
		});
		var previousWeeksAvg = calculateProcessedDailyAverageDuration(previousWeeksGroupedActivities);
		var previousWeekAvgMin = Math.round(moment.duration(previousWeeksAvg, 'seconds').asMinutes());

		return [lastWeekAvgMin, previousWeekAvgMin];
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

		if (daysCount == 0){
			return 0;
		}

		return summedDuration/daysCount;
	}

	function calculateDailyAverageDuration(rawActivityObjects){
		var groupedActivities = groupActivities(rawActivityObjects.reverse());
		groupedActivities = groupedActivities.filter(filterGroupedActivities);
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
		console.log("avg duration string: " + dateTimeUtil.getMinutesFromSeconds(avgSeconds));
		return dateTimeUtil.getMinutesFromSeconds(avgSeconds);
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
		return dateTimeUtil.getDurationStringFromSeconds(totalDuration);
	}

	function groupActivities(rawActivityObjects){
		/* pre-filter raw activities to exclude those < 0.1km*/
		rawActivityObjects = _.filter(rawActivityObjects, function(rawActivityObject){
			return rawActivityObject.quantity > 0.1;
		});

		var groupedActivities = [];
		for (var ii=0;ii<rawActivityObjects.length;ii++){
			var rawActivityObject = rawActivityObjects[ii];

			if (ii == 0){
				groupedActivityBuilder.createGroupedActivity(rawActivityObject.startDate);
			}

			var workoutEndDate = moment(rawActivityObject.endDate);
			var nextWorkout = rawActivityObjects[ii + 1];
			if (nextWorkout == null){
				groupedActivities.push(groupedActivityBuilder.getGroupedActivity(rawActivityObject.endDate));
			}
			else{
				var nextWorkoutStartDate = moment(nextWorkout.startDate);
				var timeDiffInMins = nextWorkoutStartDate.diff(workoutEndDate, "minutes");

				if (timeDiffInMins > 1){
					groupedActivityBuilder.addDistance(rawActivityObject.quantity);
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
		//assume weight is 70kg

		var durationInHours = dateTimeUtil.getDurationInHours(groupedActivity.startDate, groupedActivity.endDate)
		var kph = groupedActivity.distance/durationInHours;
		var weight = 70;
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
		getTotalDurationBetweenDateTimes: getTotalDurationBetweenDateTimes,
		getActivityDurationByDate: getActivityDurationByDate,
		calculateTwoWeeksAvgMinutes: calculateTwoWeeksAvgMinutes
	}
}]);