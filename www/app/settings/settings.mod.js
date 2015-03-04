angular.module('app.settings', ['app.stubs'])


.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider
				.state('tab.settings', {
    					url: '/settings',
    					views: {
      						'tab-settings': {
        							templateUrl: 'app/settings/settings.html'
      							}
    						}
  				})
		}
	]);






