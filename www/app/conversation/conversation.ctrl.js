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

			// upper limit constant to fake the  for waiting time after user input
			// Only in effect for normal text node.
			var USER_INPUT_DELAY_MAX = 1000;

			// upper limit constant to fake the waiting time after system input
			// Only in effect for normal text node.
			var SYSTEM_INPUT_DELAY_MAX = 2000;


			var USER_RESPONSE_ANIMATION = 'animated fadeInDown';
			var ANIMATION_END_EVENTS = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';


			// CURRENT TREE IN PROCESSING...
			var root = talky.getOnboarding('onboarding');


			var lastNodePushed = {};

			console.log('root scope: ' + $rootScope.healthkitExists);

			// actual message list which serves as the model for UI
			$scope.messages = [];

			$scope.waitIndicator = false;

			var userOptionPlaceHolder = null;
			/**
			* Method to generate a random nunmber 
			* between 0 and given limit, to simulate a wait 
			* functionality on UI
			**/
			var getRandom = function(limit){
				var randomWait = Math.floor((Math.random() * limit) + 1);
				console.log("Random wait for limit: " + limit + " is " + randomWait);
				return randomWait;

			};

			/**
			* Method to evaluate the message text as an 
			* angular expression, so that it can have some
			* runtime values which are souced from the current scope.
			* ex: User Name.
			**/
			var evalTypeStringProcessing = function(message){
				if(message.evalInfo != null 
					&& message.evalInfo.type == "string"){
					
					var evaluatedMsg = $scope.$eval(message.text);
				console.log("evaluated as >> " + evaluatedMsg);
				message.text = evaluatedMsg;	
			}
		};

			/**
			* Method used for adding the current node to the 
			* conversation UI, handles the showing of waiting icon, and
			* the processing of next node.
			* This method returns a promise for a timeout function, the 
			* caller can use this promise's callback for next steps.
			* NOTE: This method is mainly used for simple TEXT nodes, for 
			* nodes with evaluation logic look at handleEvaluationNode()
			**/
			var performAddToConversationList = function(message, waitLimit, isUserNodePresent) {
				$scope.waitIndicator = true;
				message.wait = true;	  		
				$scope.messages.push(angular.extend({}, message));
				lastNodePushed = message;
				console.log(message);
				
				
				// Need to retrieve the message from actual list, in order to 
				// update it after the random wait period.
				var lastMsgInListOnUi = $scope.messages[$scope.messages.length - 1];

				if(isUserNodePresent){
					
					userOptionPlaceHolder = root['userInputPlaceHolder'];
					userOptionPlaceHolder.bufferClass = "buffer";
					$scope.messages.push(angular.extend({}, userOptionPlaceHolder));

				}

				return $timeout( function() { 
					lastMsgInListOnUi.wait = false;
					$scope.waitIndicator = false;
					evalTypeStringProcessing(lastMsgInListOnUi);
					$ionicScrollDelegate.scrollBottom(true);
				}, 
				getRandom(waitLimit));

			};

			/**
			* Method to check if a given node is an eval node 
			* or a simple text node.
			**/
			var isThisEvaluationNode = function(node) {
				if(typeof node.evalInfo != "undefined" 
					&& node.evalInfo.type == "func") {

					return true;
				}
				return false;
			};


			var isThisChartNode = function(node) {
				if(typeof node.type != "undefined" 
					&& node.type == "chart") {

					return true;
				}
				return false;
			};


			/**
			* Method used for calling the actual evaluation function 
			* for a node. It can be any type of decision making or query to 
			* healthkit, which doesnt have a UI part to it as such
			**/
			var handleEvaluationNode = function(node){

				// adding a temporary wait node, until the actual evluation is completed.
				// The evaluation can be query to healthkit or drawing graphs
				$scope.messages.push(angular.extend({}, root['skeletonWaitNode']));

				// evalaute the method for the node, using $parse service, 
				// NOTE: Make sure the eval method always returns the next node which 
				// need to be displayed
				var evaluatedNode = $parse(node.evalInfo.method)($scope.user.minutes);

				// evaluate string in the message text
				evalTypeStringProcessing(evaluatedNode);

	    		// remove the temporary wait node now
	    		$scope.messages.pop();

	    		// add the new evaluated node to the conversation list
	    		$scope.messages.push(angular.extend({}, evaluatedNode));

	    		lastNodePushed = evaluatedNode;
	    		$ionicScrollDelegate.scrollBottom(true);
	    	};


	    	var handleChartNode = function(node){
	    		$scope.messages.push(angular.extend({}, root['skeletonWaitNode']));

	    		console.log(node.method);

	    		var promise = $parse(node.method)('test');
	    		promise.then(function(response){
	    			console.log("back in then");
		    		node.labels = response.labels;
					//node.series = ['Series A', 'Series B'];
					node.data = response.data;
										// evaluate string in the message text
		    		//evalTypeStringProcessing(evaluatedNode);
		    		
		    		// remove the temporary wait node now
		    		$scope.messages.pop();

		    		// add the new evaluated node to the conversation list
		    		$scope.messages.push(angular.extend({}, node));

		    		lastNodePushed = node;
		    		$ionicScrollDelegate.scrollBottom(true);
		    		evaluateNextNode();
		    	});
	    	}


	    	/**
	    		* Adding the very first node to the conversation
	    		* STARTING POINT OF THE APP *
	    	**/
	  		performAddToConversationList(root['onboarding'], SYSTEM_INPUT_DELAY_MAX, false)
	  										.then(function(){ 
	  											evaluateNextNode();
	  										});

	  		//TODO: To be set when we first load the data or get user input
	  		$scope.user = {
	  			name: 'Amit',
	  			minutes: 50
	  		};

	  		$scope.options = [];
  			/**
  			* Core method to evaluate and add nodes to the conversation, based on the 
  			* config tree which gets loaded in the current scope.
  			* In order to add user input option nodes, we check if the child nodes of the 
  			* given current node are of type == "user" they get added to a new list of 
  			* userOptions list property for the given node
  			**/
  			var evaluateNextNode = function() {

				var currentNodeToBeAdded = null;
				var isUserNodeRequired = false;

  				if(lastNodePushed.children.length > 0){
  					var nextNode = root[lastNodePushed.children[0]];
    				// check for evaluation type nodes
    				if(isThisEvaluationNode(nextNode)){
    					handleEvaluationNode(nextNode);
    					evaluateNextNode();
    					return;

    				} else if(isThisChartNode(nextNode)){
    					handleChartNode(nextNode);
    					
    					return;
    				} else {
						// Processing standard text nodes and their user options
						currentNodeToBeAdded = nextNode;
						currentNodeToBeAdded['userOptions'] = [];
						var childLen = currentNodeToBeAdded.children.length;
						if(childLen >= 1 && 
							root[currentNodeToBeAdded.children[0]].type != null && 
							root[currentNodeToBeAdded.children[0]].type != 'chart' ){
							isUserNodeRequired = true;
							for(i in currentNodeToBeAdded.children){
								var msg = root[currentNodeToBeAdded.children[i]];
								msg.isClickDisabled = false;
								currentNodeToBeAdded['userOptions'].push(angular.extend({}, msg));
								$scope.options.push(angular.extend({}, msg));
							}
						}
						var addToListPromise = performAddToConversationList(currentNodeToBeAdded, SYSTEM_INPUT_DELAY_MAX, isUserNodeRequired);
						/*
						If no child node of user type present, 
						move to the next system node from the config
						*/
						if(currentNodeToBeAdded.userOptions.length < 1){
							addToListPromise.then(function(){evaluateNextNode();});
						}
					}
				}

			};

	   		/**
	   		* Scope level method which gets called when a user clicks on 
	   		* one of the provided choices on the UI.
	   		*
	   		* TODO: Need to handle the UNDO functionality for the last user input
	   		**/
	   		$scope.userInput = function(message, event) {
	   			console.log("User Input Msg ");
	   			console.log(message);
	   			
	   			$timeout(function(){
        			$scope.waitIndicator = true;
        		}, 10);

	   			var recentlyAddedUserElement =  jQuery(".userMsg" ).last();
				
	   			var lastMsgInListOnUi = $scope.messages[$scope.messages.length - 1];
	   			angular.copy(message, lastMsgInListOnUi);
	   			
	   			lastMsgInListOnUi.showMeNow = true;
				lastMsgInListOnUi.bufferClass = null;

	   			recentlyAddedUserElement.addClass(USER_RESPONSE_ANIMATION);
	   			recentlyAddedUserElement.one(ANIMATION_END_EVENTS, 
					function(){
						lastMsgInListOnUi.wait = false;
			   			if(lastMsgInListOnUi.children != null && lastMsgInListOnUi.children.length > 0){
			   				$scope.options = [];
			   				// disable click after clicked once, might need to update again for undo
			   				lastMsgInListOnUi.isClickDisabled = true;
			   				var currentNodeToBeAdded = root[lastMsgInListOnUi.children[0]];

			   				if(isThisEvaluationNode(currentNodeToBeAdded)){
			   					handleEvaluationNode(currentNodeToBeAdded);
			   					evaluateNextNode();
			   				} else {
			   					$timeout(function(){
        								performAddToConversationList(currentNodeToBeAdded, USER_INPUT_DELAY_MAX, false)
			   								.then(function(){
			   										evaluateNextNode();
			   								});
        						}, 100);
			   				}
			   			}

	   			});


	   		};

	   	}
	   	]);
