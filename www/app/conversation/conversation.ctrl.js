angular.module('app.conversation')

.controller('ConversationCtrl', [
		'$rootScope',
		'$scope',
		'$state',
		'talky',
		'$ionicScrollDelegate',
		'$timeout',
		'$parse',
		function ($rootScope, $scope, $state, talky, $ionicScrollDelegate, $timeout, $parse) {


			var USER_INPUT_DELAY_MAX = 1000;
			var SYSTEM_INPUT_DELAY_MAX = 3000;
			var root = talky.getOnboarding('onboarding');

			var lastNodePushed = {};
			$scope.messages = [];

			var getRandom = function(limit){
				var randomWait = Math.floor((Math.random() * limit) + 1);
				console.log("Random wait for limit: " + limit + " is " + randomWait);
				return randomWait;

			};

			var evalTypeProcessing = function(message){
				if(message.evalType != null 
					&& message.evalType == "string"){
					
					var evaluatedMsg = $scope.$eval(message.text);
					console.log("evaluated as >> " + evaluatedMsg);
					message.text = evaluatedMsg;	
				}
			};

			var performAddToConversationList = function(message, waitLimit) {
				message.wait = true;	  		
	  			$scope.messages.push(angular.extend({}, message));
	  			lastNodePushed = message;
				console.log(message);
				
				var lastMsgInList = $scope.messages[$scope.messages.length - 1];
				return $timeout( function() { 
									lastMsgInList.wait = false;
									evalTypeProcessing(lastMsgInList);
									$ionicScrollDelegate.scrollBottom(true);
									}, 
								getRandom(waitLimit));

			};

			
	  		performAddToConversationList(root['onboarding'], SYSTEM_INPUT_DELAY_MAX)
	  										.then(function(){ 
	  											$scope.evaluateNextNode();
	  										});

	  		//TODO: To be set when we first load the data or get user input
			$scope.user = {
    				name: 'Amit'
  			};

  			
	  		

			$scope.evaluateNextNode = function() {
	    		var currentNodeToBeAdded = root[lastNodePushed.children[0]]; 
	    		currentNodeToBeAdded['display'] = [];
				var childLen = currentNodeToBeAdded.children.length;

	    		if(childLen > 1){
	    			for(i in currentNodeToBeAdded.children){
	    				var msg = root[currentNodeToBeAdded.children[i]];
	    				msg.isClickDisabled = false;
	    				currentNodeToBeAdded['display'].push(angular.extend({}, msg));

	    			}
	    		} else if (root[currentNodeToBeAdded.children[0]].type != null){
	    			var msg = root[currentNodeToBeAdded.children[0]];
	    			msg.isClickDisabled = false;
	    			currentNodeToBeAdded['display'].push(angular.extend({}, msg));
	    		}

				var addToListPromise = performAddToConversationList(currentNodeToBeAdded, SYSTEM_INPUT_DELAY_MAX);
				if(currentNodeToBeAdded.display.length < 1){
	    			addToListPromise.then(function(){$scope.evaluateNextNode();});
	    		}

	   		};

	   		$scope.userInput = function(message) {
	   			console.log("Click this ");
	   			console.log(message);
	   			if(message.children != null && message.children.length > 0){

	   				// disable click after clicked once, might need to update again for undo
	   				message.isClickDisabled = true;
	   				currentNodeToBeAdded = root[message.children[0]];
	   				performAddToConversationList(currentNodeToBeAdded, USER_INPUT_DELAY_MAX)
	   												.then(function(){
	   													$scope.evaluateNextNode();
	   												});
	   			}

	   		};

		}
	]);