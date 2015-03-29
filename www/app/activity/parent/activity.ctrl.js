angular.module('app.activity.parent')

    .controller('ActivityParentCtrl', [
    '$scope',
    '$state',
    '$ionicModal',
    'healthKitService',
    'chartConfigFactory',

function ($scope, $state, $ionicModal, healthKitService, chartConfigFactory) {

    var vm = this;
    healthKitService.getActivities().then(function (response) {
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
        title: {
            text: ""
        },
        options: {
            legend: {
                enabled: false
            }
        },

        xAxis: {
            minorTickLength: 0,
            tickLength: 0,
            labels: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            },
            gridLineWidth: 0,
            labels: {
                enabled: false
            }
        }
    };
    vm.todayVsAvg = {};
    console.log("before getTodayVsAverageDataPoints");
    healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(function (response) {
        console.log("getTodayVsAverageDataPoints");
        vm.chartConfig = chartConfigFactory.createChartConfig(response, "line");
    });

    healthKitService.getActivityDurationByDate().then(function(response){
        vm.durationsByDate = response;

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

    vm.openEditActivityModal = function (activity) {
        vm.selectedActivity = activity;
        $scope.openEditActivityModal();
    };

    vm.createActivity = function () {
        $scope.openSelectActivityTypeModal();
    };

    vm.selectActivityType = function (activityType) {
        $scope.selectedActivity = buildNewActivity(activityType);
        $scope.openCreateActivityModal();
    };

    $scope.demo = 'ios';
    $scope.setPlatform = function (p) {
        document.body.classList.remove('platform-ios');
        document.body.classList.remove('platform-android');
        document.body.classList.add('platform-' + p);
        $scope.demo = p;
    }

    buildNewActivity = function (activityType) {
        var activity = {
            activityType: activityType,
            icon: activityType.icon
        };
        // activity.activityType = activityType;
        // activity.icon = activityType.icon;
        var currentTime = new Date();

        if (activityType.activityType === "sleep") {
            activity.date = currentTime.getDate();
            activity.length = "8 hours";
            activity.timeStamp = "23:00";
        } else {
            activity.date = currentTime.getDate();
            activity.length = "5 mins";
            activity.timeStamp = currentTime.getTime();
        }

        return activity;
    };

    $ionicModal.fromTemplateUrl('app/activity/update/updateActivityModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.editActivityModal = modal;
    });
    $scope.openEditActivityModal = function () {
        $scope.editActivityModal.show();
    };
    $scope.closeEditActivityModal = function () {
        $scope.editActivityModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.editActivityModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('editActivityModal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('editActivityModal.removed', function () {
        // Execute action
    });


    $ionicModal.fromTemplateUrl('app/activity/create/createActivityModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.createActivityModal = modal;
    });
    $scope.openCreateActivityModal = function () {
        $scope.createActivityModal.show();
    };
    $scope.closeCreateActivityModal = function () {
        $scope.createActivityModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.createActivityModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('createActivityModal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('createActivityModal.removed', function () {
        // Execute action
    });

    $ionicModal.fromTemplateUrl('app/activity/create/selectActivityTypeModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.selectActivityTypeModal = modal;
    });
    $scope.openSelectActivityTypeModal = function () {
        $scope.selectActivityTypeModal.show();
    };
    $scope.closeSelectActivityTypeModal = function () {
        $scope.selectActivityTypeModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.selectActivityTypeModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('selectActivityTypeModal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('selectActivityTypeModal.removed', function () {
        // Execute action
    });


}

]);