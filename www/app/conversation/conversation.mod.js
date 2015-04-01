angular.module('app.conversation', ['app.services', 'app.factories', 'app.utils'])


.config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider
				.state('tab.conversation', {
    					url: '/conversation',
    					views: {
      						'tab-conversation': {
        							templateUrl: 'app/conversation/conversation.html'
      							}
    						}
  				})
		}
	]);






