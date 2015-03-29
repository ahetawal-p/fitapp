angular.module('app.factories')

.factory('chartConfigFactory',['dateTimeUtil',
    function(dateTimeUtil) {

        function createPlaceholderChartConfig(chartType) {
            var chartConfig = {};

            if (chartType === "line") {
                chartConfig = createPlaceholderLineChartConfig();
            } else if (chartType === "bar") {
                chartConfig = createPlaceholderBarChartConfig();
            }

            return chartConfig;
        }

        function createPlaceholderLineChartConfig() {
            var placeholderChartConfig = {
                title: {
                    text: ""
                },
                options: {
                    legend: {
                        enabled: false
                    },
                    tooltip: {
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

            return placeholderChartConfig;
        }

        function createPlaceholderBarChartConfig() {
            var placeholderChartConfig = {
                title: {
                    text: ''
                },
                xAxis: {
                    minorTickLength: 0,
                    tickLength: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
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
                },
                tooltip: {
                    enabled: false
                },
                options: {
                    chart: {
                        type: 'bar'
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            };

            return placeholderChartConfig;
        }

        function createChartConfig(chartDataContainer, chartType) {
            var chartConfig = {};
            if (chartType === "line") {
                chartConfig = createLineChartConfig(chartDataContainer);
            } else if (chartType === "bar") {
                chartConfig = createBarChartConfig(chartDataContainer);
            }

            return chartConfig;
        }

        function createLineChartConfig(chartDataContainer) {
            var chartConfig = {
                options: {
                    chart: {
                        type: 'line'
                    },
                    legend: {
                        enabled: false
                    }
                },

                //Series object (optional) - a list of series using normal highcharts series options.
                series: [{
                    name: chartDataContainer.dataSets[0].name,
                    data: chartDataContainer.dataSets[0].data,
                    marker: {
                        enabled: false
                    },
                    color: "#33C507"
                }, {
                    name: chartDataContainer.dataSets[1].name,
                    data: chartDataContainer.dataSets[1].data,
                    dashStyle: 'longdash',
                    marker: {
                        enabled: false
                    },
                    color: "#BEBEBE"

                }],
                //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
                //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
            };

            return chartConfig;
        }

        function createActivityChartBarChartConfigs(chartDataContainer) {

        }

        function createBarChartConfig(chartDataContainer) {
            var seriesData = [];
           _.each(chartDataContainer.dataSets, function(dataSet){
                seriesData.push(dataSet.data);
           }); 

           var chartConfig = {
                title: {
                    text: ''
                },
                xAxis: {
                    minorTickLength: 0,
                    tickLength: 0,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
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
                },
                series: [{
                    name: "test",
                    data: seriesData,
                    color: "#33C507",
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        color: '#FFFFFF',
                        x: -80,
                        formatter: function() {
                            var durationInSec = this.y;
                            return dateTimeUtil.getDurationStringFromSeconds(durationInSec);
                        }
                    }
                }],
                options: {
                    chart: {
                        type: 'bar'
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            };

            return chartConfig;
        }

        // function createBarChartConfig(chartDataContainer) {
        //     var seriesData = [];
        //    _.each(chartDataContainer.dataSets, function(dataSet){
        //         seriesData.push(dataSet.data);
        //    }); 
        //        // seriesData.push(chartDataContainer.dataSets[0].data);

        //    var chartConfig = {
        //         chart: {
        //             type: 'bar'
        //         },
        //         title: {
        //             text: ''
        //         },
        //         // xAxis: {
        //         //     minorTickLength: 0,
        //         //     tickLength: 0,
        //         //     labels: {
        //         //         enabled: false
        //         //     },
        //         //     title: {
        //         //         text: null
        //         //     }
        //         // },
        //         // yAxis: {
        //         //     min: 0,
        //         //     title: {
        //         //         text: ''
        //         //     },
        //         //     gridLineWidth: 0,
        //         //     labels: {
        //         //         enabled: false
        //         //     }
        //         // },
        //         series: [{
        //             name: "test",
        //             data: seriesData,
        //             color: "#33C507",
        //             dataLabels: {
        //                 enabled: true,
        //                 align: 'left',
        //                 color: '#FFFFFF',
        //                 x: -80,
        //                 formatter: function() {
        //                     var durationInSec = this.y;
        //                     return dateTimeUtil.getDurationStringFromSeconds(durationInSec);
        //                 }
        //             }
        //         }],
        //         options: {
        //             chart: {
        //                 type: 'bar'
        //             },
        //             tooltip: {
        //                 enabled: false
        //             }
        //         }
        //     };

        //     return chartConfig;
        // }

        return {
            createPlaceholderChartConfig: createPlaceholderChartConfig,
            createChartConfig: createChartConfig
        };
    }]);