(function() {
    angular.module('app.activity.parent')

    .controller('ActivityChartCtrl', [
        '$scope',
        '$state',
        '$ionicModal',
        'healthKitService',
        'chartConfigFactory',
        '$timeout',
        function($scope, $state, $ionicModal, healthKitService, chartConfigFactory, $timeout) {

            var vm = this;
            var SCROLL_ITEM_NUM = 5;
            /* testing charts */
            var startDate = new Date("3/27/2015");
            startDate.setHours(5);
            startDate.setMinutes(0);

            var endDate = new Date("3/27/2015");
            endDate.setHours(19);
            endDate.setMinutes(0);

            vm.chartConfigs = [];
            healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(function(response) {
                var chartConfig = chartConfigFactory.createActivityChartConfig(response, "line");
                vm.chartConfigs.push(chartConfig);
            });

            vm.noMoreItemsAvailable = false;
            var index = SCROLL_ITEM_NUM;
            vm.loadMore = function() {
                index = vm.durationByDateComposites.length;
                $timeout(function() {
                    vm.durationByDateComposites = vm.durationByDateComposites.concat(allComposites.slice(index, index + SCROLL_ITEM_NUM));

                    if (vm.durationByDateComposites.length >= allComposites.length) {
                        vm.noMoreItemsAvailable = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.resize');
                    $scope.$broadcast('scroll.resize')
                }, 1);
            };

            /* create bar charts */

            var allComposites = [];
            healthKitService.getActivityDurationByDate().then(function(response) {
                _.each(response, function(chartDataContainer) {
                    var durationBarChartConfig = chartConfigFactory.createActivityChartConfig(chartDataContainer, "bar");
                    var durationByDateComposite = {
                        date: new Date(durationBarChartConfig.date),
                        chartConfig: durationBarChartConfig
                    };

                    allComposites.push(durationByDateComposite);

                });
                allComposites = allComposites.reverse();
                vm.durationByDateComposites = allComposites.slice(0, SCROLL_ITEM_NUM);
                console.log('length: ' + vm.durationByDateComposites.length);
            });

            vm.openEditActivityModal = function(activity) {
                vm.selectedActivity = activity;
                $scope.openEditActivityModal();
            };

            vm.createActivity = function() {
                $scope.openSelectActivityTypeModal();
            };

            vm.selectActivityType = function(activityType) {
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

            buildNewActivity = function(activityType) {
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

        }

    ]);
})();