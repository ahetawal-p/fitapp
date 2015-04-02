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

$scope.demo = 'android';
    /* testing charts */
    var startDate = new Date("3/27/2015");
    startDate.setHours(5);
    startDate.setMinutes(0);

    var endDate = new Date("3/27/2015");
    endDate.setHours(19);
    endDate.setMinutes(0);

    vm.chartConfigs = [];
    healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(function (response) {
        var chartConfig = chartConfigFactory.createActivityChartConfig(response, "line");
        vm.chartConfigs.push(chartConfig);
    });


    /* create bar charts */
    healthKitService.getActivityDurationByDate().then(function(response){
        var durationBarChartConfigs = chartConfigFactory.createActivityChartConfig(response, "bar");
        vm.durationByDateComposites = [];
        _.each(durationBarChartConfigs, function(config){
            var durationByDateComposite = {
                date: new Date(config.date),
                chartConfig: config
            };

            vm.durationByDateComposites.push(durationByDateComposite);
        });
    });

		//TEST METHODS FOR HEALTHKIT ENDPOINTS
		// healthKitService.getAverageActivityDataPoints(new Date("3/5/2015 5:00"), new Date("3/5/2015 20:00"));
		//healthKitService.getWeekdayTimesOfDayAverages();
		//healthKitService.getWeekendTimesOfDayAverages();


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