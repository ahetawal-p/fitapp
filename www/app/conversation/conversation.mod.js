angular.module('app.conversation', ['app.services', 'app.factories', 'app.utils'])


.config(['$stateProvider', '$localstorageProvider',
		function ($stateProvider, $localstorageProvider) {
      console.log($localstorageProvider.$get().getUser());
      var myname = $localstorageProvider.$get().getUser().name;
			$stateProvider
				.state('tab.conversation', {
    					url: '/conversation',
    					views: {
      						'tab-conversation': {
        							templateUrl: function() {
                         // if(myname == "Amit1") {
                              return 'app/conversation/conversation.html';
                           // }else {
                             // return 'app/conversation/conversation_new.html';
                            //}
                        }
      							}
    						}
  				})
		}
	]);






