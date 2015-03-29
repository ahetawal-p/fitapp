angular.module('app.factories')

.factory('chartConfigFactory',
    function() {

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
                chart: {
                    type: 'bar'
                },
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
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Year 1800',
                    data: [107, 31, 635, 203, 2]
                }]
            };

            return placeholderChartConfig;
        }

        function createChartConfig(chartDataContainer, chartType) {
            var chartConfig = {};
            if (chartType === "line") {
                chartConfig = createLineChartConfig(chartDataContainer);
            }

            console.log(chartConfig);
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
            var chartConfig = {
                options: {
                    chart: {
                        type: 'bar'
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

        return {
            createPlaceholderChartConfig: createPlaceholderChartConfig,
            createChartConfig: createChartConfig
        };
    });