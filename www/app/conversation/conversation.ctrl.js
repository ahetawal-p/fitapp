angular.module('app.conversation')

.controller('ConversationCtrl', [
	'$rootScope',
	'$scope',
	'$state',
	'talky',
	'$ionicScrollDelegate',
	'$timeout',
	'$parse',
	'$localstorage',
	'$translate',
	function ($rootScope, $scope, $state, talky, $ionicScrollDelegate, $timeout, $parse, $localstorage, $translate) {


			console.log("HERRE>>>" + $translate.preferredLanguage());
			//$translate.use("en_US");

			// upper limit constant to fake the waiting time after system input
			// Only in effect for normal text node.
			var SYSTEM_INPUT_DELAY_MAX = 1500;

			var USER_RESPONSE_ANIMATION = 'animated fadeInUp';
			var ANIMATION_END_EVENTS = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

			// CURRENT TREE IN PROCESSING...
			var rootType = talky.getConversationTree().rootType;
			var fullTree = talky.getConversationTree().allNodes;
			var root = fullTree[rootType];


			var lastNodePushed = {};
			

			/**
			 * INIT Function to setup scope level User object 
			 * which is used for different eval nodes
			**/
			(function(){
				
				// UNCOMMENT FOR TESTING. IF NEEDED...
				//$localstorage.removeUser();
				
				// actual message list which serves as the model for UI
				$scope.messages = [];
				$scope.waitIndicator = false;

				$scope.user = {
						'name': null,
						'nickname' : null,
						'lastLoginTime': new Date(),
						'language' : $translate.preferredLanguage()
				};

  				if($localstorage.getUser() != null){
  					$localstorage.updateUserLoginTime();
  					angular.copy($localstorage.getUser(), $scope.user);
  				}

			})();


			var addNodeHelper = function(message, doAnimation) {
				$scope.messages.push(angular.extend({}, getTextData(message)));
				lastNodePushed =  message;
				console.log(message);
				$ionicScrollDelegate.scrollBottom(true);
			};


			var addUnserInputPlaceHolder = function(){
				var userOptionPlaceHolder = fullTree['userInputPlaceHolder'];
				userOptionPlaceHolder.bufferClass = "buffer";
				addNodeHelper(userOptionPlaceHolder, false);
			};

			/*
			* Fetch each nodes text value from the text file
			* based on the current language in use.
			* TODO: Need to add randomization for the nodes.
			*/
			var getTextData = function(message){
				if(typeof message.text === 'object'){
					var randomIndex = 0; // used for randomizing the text nodes in future
					message.text = message.text[randomIndex];
				} 
				return message;
			};

			/**
			* Method to generate a random nunmber 
			* between 0 and given limit, to simulate a wait 
			* functionality on UI
			**/
			var getRandom = function(limit){
				//var randomWait = Math.floor((Math.random() * limit) + 1);
				//console.log("Random wait for limit: " + limit + " is " + randomWait);
				// MIGHT HAVE TO FIX THIS...
				return SYSTEM_INPUT_DELAY_MAX;

			};

			/**
			* Method to evaluate the message text as an 
			* angular expression, so that it can have some
			* runtime values which are souced from the current scope.
			* ex: User Name.
			
			var evalTypeStringProcessing = function(message){
				if(message.evalInfo != null 
					&& message.evalInfo.type == "string"){
					
				var evaluatedMsg = $scope.$eval(getTextData(message).text);
				console.log("evaluated as >> " + evaluatedMsg);
				message.text = evaluatedMsg;	
			}
		}; **/

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
				
				addNodeHelper(message, true);
				
				// Need to retrieve the message from actual list, in order to 
				// update it after the random wait period.
				var lastMsgInListOnUi = $scope.messages[$scope.messages.length - 1];

				if(isUserNodePresent){
					addUnserInputPlaceHolder();
				}

				
				return $timeout( function() { 
					lastMsgInListOnUi.wait = false;
					$scope.waitIndicator = false;
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

			var isThisStrReplacerNode = function(node) {
				if(typeof node.type != "undefined" 
					&& node.type == "replacer") {

					return true;
				}
				return false;
			};


			var triggerDigestHelper = function(node, doAnimation){
				// remove later when actual promise is returned
				$timeout(function() {
					$scope.waitIndicator = true;
					// remove the temporary wait node now
	    			$scope.messages.pop();

	    			// add the new evaluated node to the conversation list
	    			addNodeHelper(node, doAnimation);
	    			
	    			constructChildNodes(node);

	    			if(node.userOptions !=null &&  node.userOptions.length >=1){
						addUnserInputPlaceHolder();
						$scope.waitIndicator = false;
						// hack to display container, somehow it doesnt show up with scope 
						// updates here 
						var userOptions = jQuery(".userMsgOptionsContainer");
						userOptions.show();
						$ionicScrollDelegate.scrollBottom(true);
					} else {
						evaluateNextNode();
					}
				}, 1700);
			};

			/**
			* Method used for calling the actual evaluation function 
			* for a node. It can be any type of decision making or query to 
			* healthkit, which doesnt have a UI part to it as such
			**/
			var handleEvaluationNode = function(node){

				// adding a temporary wait node, until the actual evluation is completed.
				// The evaluation can be query to healthkit or drawing graphs
				addNodeHelper(fullTree['skeletonWaitNode'], true);
				
				// evalaute the method for the node, using $parse service, 
				// NOTE: Make sure the eval method always returns the next node which 
				// need to be displayed
				$parse(node.evalInfo.method)($scope).then(function(nextNode){
					triggerDigestHelper(nextNode, true);
				});

			};


	    	var handleChartNode = function(node){
	    		addNodeHelper(fullTree['skeletonWaitNode'], true);
	    		//var promise = $parse(node.method)('test');
	    		var promise = node.method;
	    		promise('test').then(function(response){
	    			console.log("back in then");
					node.chartConfig = response;
		    		triggerDigestHelper(node, true);
		    	});
	    	};


	    	var handleStrReplacer = function(node){
	    		addNodeHelper(fullTree['skeletonWaitNode'], true);
	    		$parse(node.method)(node).then(function(replacedNode){
	    			triggerDigestHelper(replacedNode, true);
				});

	    	};


	    	var constructChildNodes = function(parentNode){
	    		$scope.options = [];
	    		parentNode['userOptions'] = [];
				var childLen = parentNode.children.length;
				if(childLen >= 1 
					&& fullTree[parentNode.children[0]].type == 'user'){
						
						isUserNodeRequired = true;
						for(i in parentNode.children){
							var msg = fullTree[parentNode.children[i]];
							msg.isClickDisabled = false;
							parentNode['userOptions'].push(angular.extend({}, getTextData(msg)));
							$scope.options.push(angular.extend({}, msg));
						}
				}
			};


	    	/**
	    		* Adding the very first node to the conversation
	    		* STARTING POINT OF THE APP *
	    	**/
	  		performAddToConversationList(root, SYSTEM_INPUT_DELAY_MAX, false)
	  										.then(function(){ 
	  											evaluateNextNode();
	  										});

	  		
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
  					var nextNode = fullTree[lastNodePushed.children[0]];
    				// check for evaluation type nodes
    				if(isThisEvaluationNode(nextNode)){
    					handleEvaluationNode(nextNode);
    					return;

    				} else if(isThisChartNode(nextNode)){
    					handleChartNode(nextNode);
						return;

					} else if(isThisStrReplacerNode(nextNode)){
						handleStrReplacer(nextNode);
						return;

					} else {
						// Processing standard text nodes and their user options
						currentNodeToBeAdded = nextNode;
						
						constructChildNodes(currentNodeToBeAdded);
						
						if(currentNodeToBeAdded.userOptions.length >=1){
							isUserNodeRequired = true;
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
	   			
	   			var isUserNodeRequired = false;
	   			var currentNodeToBeAdded = null;
	   			var recentlyAddedUserElement = jQuery(".userMsg").last();
				
				// TODO: Refactor to use directive since, we shld not 
				// make dom updates in controller directly
				var userOptions = jQuery(".userMsgOptionsContainer");
				userOptions.hide();
				
	   			var lastMsgInListOnUi = $scope.messages[$scope.messages.length - 1];
	   			angular.copy(message, lastMsgInListOnUi);
	   			
	   			lastMsgInListOnUi.showMeNow = true;
				lastMsgInListOnUi.bufferClass = null;

	   			recentlyAddedUserElement.addClass(USER_RESPONSE_ANIMATION);
	   			recentlyAddedUserElement.one(ANIMATION_END_EVENTS, 
					function(){
						// need to eval async to run it inside angular scope instead of jquery scope
						$scope.$evalAsync(function(){
							$scope.waitIndicator = false;
							lastMsgInListOnUi.wait = false;
							lastNodePushed = lastMsgInListOnUi;
							evaluateNextNode();
			   				
					});
				});

	   		};

	   	}
	]);
