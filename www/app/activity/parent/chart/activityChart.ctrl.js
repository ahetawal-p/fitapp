(function(){
angular.module('app.activity.parent')

.controller('ActivityChartCtrl', [
	'$scope',
	'$state',
	'$ionicModal',
	'healthKitService',
	'chartConfigFactory',
	function ($scope, $state, $ionicModal, healthKitService, chartConfigFactory) {

		var vm = this;
		healthKitService.getActivities().then(function(response){
			//console.log(JSON.stringify(response));
			vm.activities = response;
		});

		//TEST METHODS FOR HEALTHKIT ENDPOINTS
		// healthKitService.getAverageActivityDataPoints(new Date("3/5/2015 5:00"), new Date("3/5/2015 20:00"));
		//healthKitService.getWeekdayTimesOfDayAverages();
		//healthKitService.getWeekendTimesOfDayAverages();


		/* testing charts */
		var startDate = new Date("3/20/2015");
		startDate.setHours(5);
		startDate.setMinutes(0);

		var endDate = new Date("3/20/2015");
		endDate.setHours(19);
		endDate.setMinutes(0);
			vm.chartConfig = {
        options: {
            chart: {
                type: 'bar',
                zoomType: 'x'
            },
            legend: {
                enabled: false   
            }
        },
    };
		vm.todayVsAvg = {};
		console.log("before getTodayVsAverageDataPoints");
		healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(function(response){
			console.log("getTodayVsAverageDataPoints");
			vm.chartConfig = {
        
        series: [{
            data: [10, 15, 12, 8, 7, 1, 1, 19, 15, 10]
        }],
        title: {
            text: 'aa'
        },
        xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
        loading: false
    };
			// vm.todayVsAvg.labels = response.labels;
			// vm.todayVsAvg.data = response.data;

			/* total duration is last index of array, since array has cumulative duration
			also need to convert seconds to minuts */
			// var todaysTotalDuration = Math.ceil(_.last(vm.todayVsAvg.data[0])/60);
			// var avgTotalDuration = Math.ceil(_.last(vm.todayVsAvg.data[1])/60);

			// vm.todayVsAvg.todaysDuration = todaysTotalDuration + " min";
			// vm.todayVsAvg.averageDuration = avgTotalDuration + " min";

			// if (todaysTotalDuration > avgTotalDuration){
			// 	vm.todayVsAvg.todaysDurationMarginTop = 50;
			// 	vm.todayVsAvg.averageDurationMarginTop = 27;
			// }else{
			// 	vm.todayVsAvg.todaysDurationMarginTop = 27;
			// 	vm.todayVsAvg.averageDurationMarginTop = 50;
			// }
		});


		// healthKitService.getActivityDataPoints(startDate, new Date()).then(function(response){
			
		// 	//console.log(JSON.stringify(response));
		// 	vm.labels = response.times;
		// 	  //vm.series = ['Series A', 'Series B'];
		// 	 vm.data = [response.durations];
		// });


		// .then(function(){
		// 		return healthKitService.getAverageActivityDataPoints(new Date("3/5/2015 5:00"), new Date());
		// })
		// .then(function(response){
		// 	vm.data.push(response.durations);
		// });






		// healthKitService.getActivityDataPoints(startDate, new Date()).then(function(response){
			

			// vm.labels = ["7am", "", "", "", "", "", "now"];
			//   //vm.series = ['Series A', 'Series B'];
			//   vm.data = [
			//     [65, 59, 80, 81, 56, 55, 40]
			//     //,[28, 48, 40, 19, 86, 27, 90]
			//   ];
		// });

/* end */

vm.openEditActivityModal = function(activity){
	vm.selectedActivity = activity;
	$scope.openEditActivityModal();
};

vm.createActivity = function(){
	$scope.openSelectActivityTypeModal();
};

vm.selectActivityType = function(activityType){
	$scope.selectedActivity = buildNewActivity(activityType);
	$scope.openCreateActivityModal();
};

$scope.demo = 'ios';
$scope.setPlatform = function(p) {
	document.body.classList.remove('platform-ios');
	document.body.classList.remove('platform-android');
	document.body.classList.add('platform-' + p);
	$scope.demo = p;
}

buildNewActivity = function(activityType){
	var activity = {activityType:activityType
		, icon: activityType.icon};
      // activity.activityType = activityType;
      // activity.icon = activityType.icon;
      var currentTime = new Date();

      if (activityType.activityType === "sleep"){
      	activity.date = currentTime.getDate();
      	activity.length = "8 hours";
      	activity.timeStamp = "23:00";
      }else{
      	activity.date = currentTime.getDate();
      	activity.length = "5 mins";
      	activity.timeStamp = currentTime.getTime();
      }

      return activity;
  };




      	}	

      	]);
})();