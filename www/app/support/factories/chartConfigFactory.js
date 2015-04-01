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
        /* create charts for conversation page */
        function createConversationChargConfig(chartDataContainer, chartType, chartTitle) {
            var chartConfig = {};
            if (chartType === "line") {
                chartConfig = createConversationLineChartConfig(chartDataContainer, chartTitle);
            } else if (chartType === "bar") {
                chartConfig = createConversationBarChartConfigs(chartDataContainer, chartTitle);
            }

            return chartConfig;
        }

        function getTotalDuration(durationsArray){
            var totalDuration = _.max(durationsArray, function(dataPoint){
                return dataPoint;
            });

            return totalDuration;
        }

        function createConversationLineChartConfig(chartDataContainer, chartTitle){
            var todaysDurations = chartDataContainer.dataSets[0].data;
            var todayTotalDuration = getTotalDuration(chartDataContainer.dataSets[0].data);
            var todayTotalDurationString = dateTimeUtil.getDurationStringFromSeconds(todayTotalDuration);
            var firstActivityIndex = _.findIndex(todaysDurations, function(dataPoint){
                return dataPoint > 0;
            });
            var firstActivityTime = chartDataContainer.labels[firstActivityIndex];

            var avgTotalDuration = getTotalDuration(chartDataContainer.dataSets[1].data);
            var avgTotalDurationString = dateTimeUtil.getDurationStringFromSeconds(avgTotalDuration);
            var chartConfig = {
                title: {
                    text: chartTitle,
                    style: {
                        fontSize: "12px",
                        color: "white"
                    }
                },
                xAxis: {
                    minorTickLength: 0,
                    tickLength: 0,
                    categories: chartDataContainer.labels,
                    labels: {
                        enabled: true,
                        formatter: function(){
                            if (this.value === firstActivityTime){
                                return dateTimeUtil.getAmPm(this.value);
                            } else if (this.isLast){
                                return dateTimeUtil.getAmPm(this.value);
                            }
                        },
                        style: {
                            color: "white"
                        }
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
                        type: 'line',
                        backgroundColor: "rgba(0,0,0, 0.1)",
                        fillOpacity: 0.8
                    },
                    labels: {
                        items: [{
                            html: '<span>' + todayTotalDurationString + '</span>',
                            style: {
                                left: "10px",
                                top: "5px",
                                fontSize: "10px",
                                margin: "0px",
                                color: "#33C507",
                                  itemMarginTop: 0,
                                itemMarginBottom: 0
                            }

                        },
                        {
                            html: '<span>' + avgTotalDurationString + '</span>',
                            style: {
                                left: "10px",
                                top: "20px",
                                fontSize: "10px",
                                color: "#fff"
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
                    dashStyle: 'shortdash',
                    marker: {
                        enabled: false
                    },
                    color: "#fff"

                }]
            };

            return chartConfig;
        }

        function createConversationBarChartConfigs(chartDataContainer){

        }

        /* create charts for activity charts page */
        function createActivityChartConfig(chartDataContainer, chartType) {
            var chartConfig = {};
            if (chartType === "line") {
                chartConfig = createActivityLineChartConfig(chartDataContainer);
            } else if (chartType === "bar") {
                chartConfig = createActivityChartBarChartConfigs(chartDataContainer);
            }

            return chartConfig;
        }

        function createActivityLineChartConfig(chartDataContainer) {
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
                    dashStyle: 'shortdash',
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
                        x: -100,
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
            createActivityChartConfig: createActivityChartConfig,
            createConversationChargConfig: createConversationChargConfig
        };
    }]);