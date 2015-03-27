angular.module('app.activity.parent', ['app.services.healthKit', 'chart.js', 'app.factories'])

.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider
        .state('tab.activity', {
          url: "/activity",
          abstract: true,
          views: {
              'tab-activity': {
                  templateUrl: 'app/activity/parent/activity.html'
              }
          }
        })
        
        .state('tab.activity.activityList', {
            url: "/activityList",
            views: {
                'activity-page': {
                    templateUrl: "app/activity/parent/list/activityList.html"
                }
            }
        })
        
        .state('tab.activity.activityChart', {
            url: "/activityChart",
            views: {
                'activity-page': {
                    templateUrl: "app/activity/parent/chart/activityChart.html"
                }
            }
        });
			}
	]);
