(function() {
    angular.module('app.activity.parent')

    .controller('ActivityChartCtrl', [
        '$scope',
        'healthKitService',
        'chartConfigFactory',
        '$timeout',
        '$q',
        'dateTimeUtil',
        function($scope, healthKitService, chartConfigFactory, $timeout, $q, dateTimeUtil) {

            var vm = this;
            vm.selectedDate = "";
            var SCROLL_ITEM_NUM = 5;
            var allComposites;
            var loader;

            var chartLoader = function(){

                function loadLineChart(date){
                    vm.selectedDate = dateTimeUtil.getLocalizedDateString(date);
                    var startDate = moment(date);
                        startDate.hours(0);
                        startDate.minutes(0);

                    // assign current time as endDate time
                    var currTime = new moment();
                    var endDate = moment(date);
                        endDate.hours(currTime.hours());
                        endDate.minutes(currTime.minutes());
                    return healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(function(response) {
                        var chartConfig = chartConfigFactory.createActivityChartConfig(response, "line");
                        vm.chartConfigs[0] = chartConfig;
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
                    var date = moment();
                    loadLineChart(date).then(loadActivityBarCharts).then(function(){
                        deferred.resolve();
                    });

                    return deferred.promise;
                }

                function loadActivityBarCharts(){
                    return healthKitService.getActivityDurationByDate().then(function(response) {
                        _.each(response, function(chartDataContainer) {
                            var durationBarChartConfig = chartConfigFactory.createActivityChartConfig(chartDataContainer, "bar");
                            durationBarChartConfig.options.plotOptions.series.events = {
                                click: function(){
                                loadLineChart(durationBarChartConfig.date);
                                }
                            };

                            var durationByDateComposite = {
                                date: new moment(durationBarChartConfig.date),
                                chartConfig: durationBarChartConfig
                            };

                            allComposites.push(durationByDateComposite);

                        });
                        allComposites = allComposites.reverse();
                        vm.durationByDateComposites = allComposites.slice(0, SCROLL_ITEM_NUM);
                    });
                }

                return {
                    loadLineChart: loadLineChart,
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