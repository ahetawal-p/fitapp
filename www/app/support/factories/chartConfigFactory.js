angular.module('app.factories')

.factory('chartConfigFactory',['dateTimeUtil',
    function(dateTimeUtil) {

/*
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
                        enabled: true,
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        floating: true
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
             lineWidth: 0, 
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
*/

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

            function getTotalDuration(durationsArray){
                var totalDuration = _.max(durationsArray, function(dataPoint){
                    return dataPoint;
                });

                return totalDuration;
            }

            var todayTotalDuration = getTotalDuration(chartDataContainer.dataSets[0].data);
            var todayTotalDurationString = dateTimeUtil.getDurationStringFromSeconds(todayTotalDuration);

            var avgTotalDuration = getTotalDuration(chartDataContainer.dataSets[1].data);
            var avgTotalDurationString = dateTimeUtil.getDurationStringFromSeconds(avgTotalDuration);

            var chartConfig = {
                title: {
                    text: ""
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
                },
                options: {
                    chart: {
                        renderTo: "container",
                        type: 'line'
                    },
                    labels: {
                        items: [{
                            html: '<div id=""><span>TODAY</span><br><span>' + todayTotalDurationString + '</span></div>',
                            style: {
                                left: "10px",
                                top: "5px",
                                fontSize: "8px",
                                margin: "0px",
                                color: "#33C507",
                                  itemMarginTop: 0,
                                itemMarginBottom: 0
                            }

                        },
                        {
                            html: '<div id="averageDurationLabel"><span>AVG</span><br><span>' + avgTotalDurationString + '</span>',
                            style: {
                                left: "10px",
                                top: "40px",
                                fontSize: "8px",
                                color: "#BEBEBE"
                            }

                        }]
                    },  
                    tooltip : {
                        enabled: false
                    },
                    legend: {
                        enabled: false,
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        floating: true,
                        labelFormatter: function(){
                            var totalDurationSeconds = getTotalDuration(this.yData);
                            return dateTimeUtil.getDurationStringFromSeconds(totalDurationSeconds);
                        }
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

                }]
            };

            return chartConfig;
        }

        function createActivityChartBarChartConfigs(chartDataContainer) {
           var chartConfigs = [];
           var maxDurationObject = _.max(chartDataContainer.dataSets, function(dataSet){
                return dataSet.data;
           });
           var maxYValue = maxDurationObject.data;

           _.each(chartDataContainer.dataSets, function(dataSet){
                chartConfigs.push(createBarChartConfig(dataSet, maxYValue));
           }); 

           return chartConfigs;
        }

        function createBarChartConfig(dataSet, maxYValue) {
            var seriesData = [];
           seriesData.push(dataSet.data);
           var chartConfig = {
                date: dataSet.name,
                dayOfMonth: dateTimeUtil.getDayOfMonth(dataSet.name),
                dayOfWeekName: dateTimeUtil.getDayOfWeekName(dataSet.name),
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
                    max: maxYValue,
                    title: {
                        text: ''
                    },
                    gridLineWidth: 0,
                    lineWidth: 0,      

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
                        style: {
                          textShadow: "none",
                          fontSize: "15px"
                        },
                        x: -90,
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
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            pointWidth: 70
                        }
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

        //    var chartConfig = {
        //         title: {
        //             text: ''
        //         },
        //         xAxis: {
        //             minorTickLength: 0,
        //             tickLength: 0,
        //             labels: {
        //                 enabled: false
        //             },
        //             title: {
        //                 text: null
        //             }
        //         },
        //         yAxis: {
        //             min: 0,
        //             title: {
        //                 text: ''
        //             },
        //             gridLineWidth: 0,
        //             lineWidth: 0,      

        //             labels: {
        //                 enabled: false
        //             }
        //         },
        //         series: [{
        //             name: "test",
        //             data: seriesData,
        //             color: "#33C507",
        //             pointWidth: 30,
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
            createChartConfig: createChartConfig,
            createActivityChartBarChartConfigs: createActivityChartBarChartConfigs
        };
    }]);