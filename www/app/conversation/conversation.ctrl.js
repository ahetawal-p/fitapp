angular.module('app.conversation')

.controller('ConversationCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'$ionicScrollDelegate',
		function ($rootScope, $scope, $state, $ionicScrollDelegate) {

			var vm = this;
	  		var messageOptions = [
	        	{ content: '<p>Nice to have you back so soon!</p>' },
            	{ content: '<p>You\'re coming in at 5 minutes so far.</p>' },
            	{ content: '<p>Not quite where you usually are on weekdays</p>' },
            	{ content: '<p>As you noted, you\'ve been busy today!</p>' },
            	{ content: '<p>Hope your busy day went well!</p>' }
	 		 ];
	 
	  		var messageIter = 0;
	  		$scope.messages = messageOptions.slice(0, messageOptions.length);

	  		$scope.add = function() {
	    		var nextMessage = messageOptions[messageIter++ % messageOptions.length];
	    		$scope.messages.push(angular.extend({}, nextMessage));
	    		$ionicScrollDelegate.scrollBottom(true);
	   		};
		}
	]);