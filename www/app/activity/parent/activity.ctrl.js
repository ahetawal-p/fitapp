angular.module('app.activity.parent')

.controller('ActivityParentCtrl', [
	'$scope',
	'$state',
	'$ionicModal',
	'healthKitService',
	function ($scope, $state, $ionicModal, healthKitService) {

		var vm = this;
		healthKitService.getActivities().then(function(response){
			//console.log(JSON.stringify(response));
			vm.activities = response;
		});

		//TEST METHODS FOR HEALTHKIT ENDPOINTS
		// healthKitService.getAverageActivityDataPoints(new Date("3/5/2015 5:00"), new Date("3/5/2015 20:00"));
		//healthKitService.getWeekdayTimesOfDayAverages();
		//healthKitService.getWeekendTimesOfDayAverages();

//This is not a highcharts object. It just looks a little like one!
vm.chartConfig = {

  options: {
      //This is the Main Highcharts chart config. Any Highchart options are valid here.
      //will be overriden by values specified below.
      chart: {
          type: 'line'
      },
      tooltip: {
          style: {
              padding: 10,
              fontWeight: 'bold'
          }
      }
  },
  //The below properties are watched separately for changes.

  //Series object (optional) - a list of series using normal highcharts series options.
  series: [{
     data: [10, 15, 12, 8, 7],
     dashStyle: 'longdash'
  }],
  //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
  //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
  xAxis: {
  currentMin: 0,
  currentMax: 20,
  title: {text: 'values'}
  },
};

		/* testing charts */
		var startDate = new Date("3/20/2015");
		startDate.setHours(5);
		startDate.setMinutes(0);

		var endDate = new Date("3/20/2015");
		endDate.setHours(19);
		endDate.setMinutes(0);

		vm.todayVsAvg = {};
		console.log("before getTodayVsAverageDataPoints");
		healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(function(response){
			console.log("getTodayVsAverageDataPoints");
			vm.todayVsAvg.labels = response.labels;
			vm.todayVsAvg.data = response.data;

			/* total duration is last index of array, since array has cumulative duration
			   also need to convert seconds to minuts */
			var todaysTotalDuration = Math.ceil(_.last(vm.todayVsAvg.data[0])/60);
			var avgTotalDuration = Math.ceil(_.last(vm.todayVsAvg.data[1])/60);

			vm.todayVsAvg.todaysDuration = todaysTotalDuration + " min";
			vm.todayVsAvg.averageDuration = avgTotalDuration + " min";

			if (todaysTotalDuration > avgTotalDuration){
				vm.todayVsAvg.todaysDurationMarginTop = 50;
				vm.todayVsAvg.averageDurationMarginTop = 27;
			}else{
				vm.todayVsAvg.todaysDurationMarginTop = 27;
				vm.todayVsAvg.averageDurationMarginTop = 50;
			}
		});
vm.todayVsAvg.pointDot = [
false, false]

		vm.todayVsAvg.colors = ['#FD1F5E','#1EF9A1'];


		vm.todayVsAvg.options = {
			pointDot:false, 
			scaleShowGridLines:false, 
			showTooltips:false, 
			responsive:true, 
			scaleShowLabels: false,
			    pointDotRadius: 1

		};

		vm.youVsOthers = {};
		healthKitService.getDailyAverageVsAllUsers().then(
			function(response){
				console.log(response.labels);
				vm.youVsOthers.labels = [""];
				vm.youVsOthers.series = response.labels;
				vm.youVsOthers.data = response.data;
				vm.youVsOthers.yourDuration = vm.youVsOthers.data[0] + "min";
				vm.youVsOthers.othersDuration = vm.youVsOthers.data[1] + "min";
				vm.youVsOthers.yourDurationPaddingLeft = 20;
				vm.youVsOthers.othersDurationPaddingLeft = 66;
			}
		);

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

  $ionicModal.fromTemplateUrl('app/activity/update/updateActivityModal.html', {
  	scope: $scope,
  	animation: 'slide-in-up'
  }).then(function(modal) {
  	$scope.editActivityModal = modal;
  });
  $scope.openEditActivityModal = function() {
  	$scope.editActivityModal.show();
  };
  $scope.closeEditActivityModal = function() {
  	$scope.editActivityModal.hide();
  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		  	$scope.editActivityModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('editActivityModal.hidden', function() {
		    // Execute action
		});
		  // Execute action on remove modal
		  $scope.$on('editActivityModal.removed', function() {
		    // Execute action
		});
		  

		  $ionicModal.fromTemplateUrl('app/activity/create/createActivityModal.html', {
		  	scope: $scope,
		  	animation: 'slide-in-up'
		  }).then(function(modal) {
		  	$scope.createActivityModal = modal;
		  });
		  $scope.openCreateActivityModal = function() {
		  	$scope.createActivityModal.show();
		  };
		  $scope.closeCreateActivityModal = function() {
		  	$scope.createActivityModal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		  	$scope.createActivityModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('createActivityModal.hidden', function() {
		    // Execute action
		});
		  // Execute action on remove modal
		  $scope.$on('createActivityModal.removed', function() {
		    // Execute action
		});

		  $ionicModal.fromTemplateUrl('app/activity/create/selectActivityTypeModal.html', {
		  	scope: $scope,
		  	animation: 'slide-in-up'
		  }).then(function(modal) {
		  	$scope.selectActivityTypeModal = modal;
		  });
		  $scope.openSelectActivityTypeModal = function() {
		  	$scope.selectActivityTypeModal.show();
		  };
		  $scope.closeSelectActivityTypeModal = function() {
		  	$scope.selectActivityTypeModal.hide();
		  };
      	  //Cleanup the modal when we're done with it!
      	  $scope.$on('$destroy', function() {
      	  	$scope.selectActivityTypeModal.remove();
      	  });
      	  // Execute action on hide modal
      	  $scope.$on('selectActivityTypeModal.hidden', function() {
        	// Execute action
        });
      	  // Execute action on remove modal
      	  $scope.$on('selectActivityTypeModal.removed', function() {
        // Execute action
    });


      	}	

      	]);