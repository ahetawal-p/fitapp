angular.module('app.activity.parent', ['app.services'])

.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider
				.state('tab.activity', {
    						url: '/activity',
    						views: {
      							'tab-activity': {
        							templateUrl: 'app/activity/parent/activity.html'
      							}
    						}
  					})
			}
	]);
