(function() {
    angular.module('app.activity.parent')

    .controller('ActivityChartCtrl', [
        '$scope',
        'healthKitService',
        'chartConfigFactory',
        '$timeout',
        '$q',
        function($scope, healthKitService, chartConfigFactory, $timeout, $q) {

            var vm = this;
            var SCROLL_ITEM_NUM = 5;
            var allComposites;
            var loader;

            var chartLoader = function(){
                var startDate, endDate;

                function initializeDates(){
                    startDate = moment();
                    startDate.hours(0);
                    startDate.minutes(0);
                    endDate = moment();
                }

                function loadTodaysLineChart(){
                    return healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(function(response) {
                        var chartConfig = chartConfigFactory.createActivityChartConfig(response, "line");
                        vm.chartConfigs.push(chartConfig);
                    });
                }

                function loadMore(){
                    if (!vm.durationByDateComposites){
                        return false;
                    }

                    var index = vm.durationByDateComposites.length;
                    $timeout(function() {
                        vm.durationByDateComposites = vm.durationByDateComposites.concat(allComposites.slice(index, index + SCROLL_ITEM_NUM));

                        if (vm.durationByDateComposites.length >= allComposites.length) {
                            vm.noMoreItemsAvailable = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.$broadcast('scroll.resize');
                    }, 1);
                }

                function loadAllCharts(){
                    var deferred = $q.defer();
                    initializeDates();
                    loadTodaysLineChart().then(loadActivityBarCharts).then(function(){
                        deferred.resolve();
                    });

                    return deferred.promise;
                }

                function loadActivityBarCharts(){
                    return healthKitService.getActivityDurationByDate().then(function(response) {
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
                    });
                }

                return {
                    initializeDates: initializeDates,
                    loadTodaysLineChart: loadTodaysLineChart,
                    loadActivityBarCharts: loadActivityBarCharts,
                    loadMore: loadMore,
                    loadAllCharts: loadAllCharts     
                }
            }

            loadCharts();

            function loadCharts(){
                initializeValues();
                loader.loadAllCharts();
            }

            function initializeValues(){
                vm.chartConfigs = [];
                allComposites = [];
                vm.noMoreItemsAvailable = false;
                loader = new chartLoader();
            }

            vm.loadMore = function (){loader.loadMore()};
            vm.reloadCharts = function(){
                loadCharts();
                $scope.$broadcast('scroll.refreshComplete');

            }
        }

    ]);
})();