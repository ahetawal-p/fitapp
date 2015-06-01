(function() {
    angular.module('app.activity.parent')

    .controller('ActivityChartCtrl', [
        '$scope',
        'healthKitService',
        'chartConfigFactory',
        '$timeout',
        '$q',
        'dateTimeUtil',
        '$ionicLoading', 
        function($scope, healthKitService, chartConfigFactory, $timeout, $q, dateTimeUtil, $ionicLoading) {

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
                    var endDate = __getEndDate(date);
                    return healthKitService.getDateVsAverageDataPoints(startDate, endDate).then(function(response) {
                        console.log(JSON.stringify(response));
                        $ionicLoading.hide();
                        var chartConfig = chartConfigFactory.createActivityChartConfig(response, "line");
                        vm.chartConfigs[0] = chartConfig;
                    });
                }

                function __getEndDate(date){
                    var endDateTime = moment(date);
                    var currDateTime = new moment();
                    var sameDay = endDateTime.dayOfYear() === currDateTime.dayOfYear();
                    
                    /* if selected date is today, use current time
                     * else, use full day */
                    if (sameDay){
                        endDateTime.hours(currDateTime.hours());
                        endDateTime.minutes(currDateTime.minutes());                    
                    } else {
                        endDateTime.hours(23);
                        endDateTime.minutes(59);
                    }

                    return endDateTime;
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
                                    $ionicLoading.show({
                                        content: 'Loading',
                                        animation: 'fade-in',
                                        showBackdrop: false,
                                        maxWidth: 200,
                                        showDelay: 0
                                    });

                                    loadLineChart(durationBarChartConfig.date);
                                }
                            };
                            var durationByDateComposite = {
                                date:  moment(durationBarChartConfig.date),
                                chartConfig: durationBarChartConfig
                            };
                            console.log("DATE: " + durationByDateComposite.date.date() + " CHARTCONFIG: " + durationByDateComposite.chartConfig.series[0].data);

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