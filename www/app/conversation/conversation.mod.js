angular.module('app.conversation', ['app.services'])


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






