angular.module('app.factories')

.factory('chartConfigFactory', 
	function() {

    function createChartConfig(chartDataContainer, chartType){
        var chartConfig = {};
        if (chartType === "line"){
            chartConfig = createLineChartConfig(chartDataContainer);
        }

        return chartConfig;
    }

	function createLineChartConfig(chartDataContainer){

            var chartConfig = {
                  title: {
                    text: ''
                  },
                  legend: {
                    enabled: false
                  },
                xAxis: {
                   
                   lineWidth: 0,
                   minorGridLineWidth: 0,
                   lineColor: 'transparent',
                         
                   labels: {
                       enabled: false
                   },
                   minorTickLength: 0,
                   tickLength: 0
                },
                yAxis: {
                    labels: {
                    enabled: false
                }
              },
              //   options: {
              //     //This is the Main Highcharts chart config. Any Highchart options are valid here.
              //     //will be overriden by values specified below.
              //     chart: {
              //       type: 'series'
              //     },
              //     tooltip: {
              //       style: {
              //           padding: 10,
              //           fontWeight: 'bold'
              //       }
              //     },
              //     marker: {
              //       enabled: false
              //     }
              // },

              //Series object (optional) - a list of series using normal highcharts series options.
              series: [{
                name: chartDataContainer.dataSets[0].name,
                data: chartDataContainer.dataSets[0].data,
                marker: {
                    enabled:false
                },
                color: "#33C507"
              },
              {
                name: chartDataContainer.dataSets[1].name,
                data: chartDataContainer.dataSets[1].data,
                dashStyle: 'longdash',
                marker: {
                    enabled:false
                },
                color: "#BEBEBE"

              }],
              //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
              //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
            };

            return chartConfig;
    }

  return {
    createChartConfig: createChartConfig
      };
});