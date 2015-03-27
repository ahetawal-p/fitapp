angular.module('app.services')

/**
 * A simple example service that returns tree data for conversation
 */
.factory('talky', ['healthKitService', '$q', '$ionicPlatform', function(healthKitService, $q, $ionicPlatform) {

	
	$ionicPlatform.ready(function() {
		var colorConfig = {
					"0" : ['120deg', '#FFCC99', '#CCCC99'],
					"1" : ['-45deg', '#FFCC99', '#6633CC'],
					"2" : ['-92deg', '#999900', '#6633FF'],
					"3" : ['50deg',  '#33FFFF', '#006600'],
					"4" : ['-108deg', '#FF0066', '#00FF99']
				};

		var randomColor = Math.floor((Math.random() * 10)%5);
		console.log(randomColor);
		var stylingString = "-webkit-linear-gradient(" +
					colorConfig[randomColor][0] + "," +
					colorConfig[randomColor][1] + "," +
					colorConfig[randomColor][2] + "" +  ")";

		jQuery(".scroll-content").css('background', stylingString);

	  });


	// Sample method to show how can we provide the 
	// runtime decision making in the conversation UI
	// Can be used for similar stuff when we call the 
	// health kit for data and decide on next nodes in conversation.
	var testMethod = function(minutes) {
		if(minutes > 50){
			return treeData['aboveAverage'];
		}else if(minutes == 50){
			return treeData['onParAverage'];
		}else{
			return treeData['belowAverage'];
		}

	};

	var getChartData = function(type) {
		console.log("Running data here...");

		var deferred = $q.defer();
		var startDate = new Date("3/20/2015");
		startDate.setHours(5);
		startDate.setMinutes(0);

		var endDate = new Date("3/20/2015");
		endDate.setHours(19);
		endDate.setMinutes(0);
		healthKitService.getTodayVsAverageDataPoints(startDate, endDate).then(
			function(response){
				deferred.resolve(response);
			},
			function(error){
				deferred.reject(error);
			}
		);
		console.log("1 Running data here...");
		
        return deferred.promise;
	};


	var treeData = {
		root: ['onboarding', 'onboardingInfo'],

		// used when actual processing is in-progress for user data
		'skeletonWaitNode' : {
			wait : true,
		},

		'userInputPlaceHolder' : {
			type: "user",
			wait : false
		},

		'onboarding' : {
			text: ['0'],
			children: ['askName']
		},
		'askName': {
			text: ['0'],
			children: ['userName']
		},
		'userName': {
			text: "TODO UPDATE > My Name is User",
			type: "user",
			children: ['greetUser']
		},
		'greetUser': {
			text: ['0'],
			evalInfo : {
				type : "string",
			},
			children: ['lookData']
		},
		'lookData':{
			text: ['0'],
			children: ['includeHApp']
		},
		'includeHApp':{
			text: ['0'],
			children:['askWouldLike']
		},
		'askWouldLike': {
			text: ['0'],
			children:['userAgree', 'userExplain']
		},
		'userAgree': {
			text: ['0'],
			type: "user",
			children: ['onboardingInfo']
		},
		'userExplain':{
			text: ['0'],
			type: "user",
			children: ['onboardingInfo']
		},
		'onboardingInfo': {
			text: ['0'],
			children:['moreOnboardingInfo']
		},
		'moreOnboardingInfo': {
			text: ['0'],
			children: ['furtherOnboardingInfo']
		},
		'furtherOnboardingInfo': {
			text: ['0'],
			children: ['onboardingInfoUserConfirm','onboardingInfoUserNo']
		},
		'onboardingInfoUserConfirm': {
			text: ['0'],
			type: "user",
			//children: ['dummyAnalyzer']
			children : ['openHealthApp']
		},
		'onboardingInfoUserNo': {
			text: ['0'],
			type: "user",
			children: ['collectInfo']
		},

		'collectInfo': {
			text: ['0'],
			children: ['whenReady']
		},
		'whenReady': {
			text: ['0'],
			children: ['gotoSettings']
		},
		'gotoSettings': {
			text: ['0'],
			children: ['gotoSettingsOk']
		},
		'gotoSettingsOk': {
			text: ['0'],
			type: "user",
			children: ['lookingForward']
		},
		'lookingForward': {
			text: ['0'],
			children: []
		},

		'openHealthApp': {
			text: "FIX ME : NEED TO OPEN Health App here...",
			children: ['addDataHApp']
		},
		'addDataHApp': {
			text: ['0'],
			children: ['addDataOk']
		},
		'addDataOk': {
			text: ['0'],
			type: "user",
			children: ['activityOnPhone']
		},
		'activityOnPhone': {
			text: ['0'],
			children: []
		},
		'activityOnPhoneOk': {
			text: ['0'],
			type: "user",
			children: ['dummyAnalyzer']
		},
		
		'activityOnPhone?': {
			text: ['0'],
			type: "user",
			children: ['activityOnPhoneExplain']
		},

		'activityOnPhoneExplain': {
			text: ['0'],
			children: ['activityOnPhoneExplainMore']
		},

		'activityOnPhoneExplainMore': {
			text: ['0'],
			children: ['activityOnPhoneIsee']
		},

		'activityOnPhoneIsee': {
			text: ['0'],
			type: "user",
			children: ['activityOnPhoneLookData']
		},

		'activityOnPhoneLookData?': {
			text: ['0'],
			children: ['activityOnPhoneSure', 'activityOnPhoneNotNow']
		},

		'activityOnPhoneSure': {
			text: ['0'],
			type: "user",
			children: []
		},
		'activityOnPhoneNotNow': {
			text: ['0'],
			type: "user",
			children: ['']
		},
		
		'dummyAnalyzer' : {
			evalInfo : {
				type : "func",
				method : testMethod,
			},
			children:[]
		},
		'aboveAverage':{
			text: ['0'],
			children:['moreActiveTip']
		},
		'onParAverage':{
			text: ['0'],
			children:['moreActiveTip']
		},
		'belowAverage': {
			text: ['0'],
			children:['moreActiveTip']
		},
		'moreActiveTip': {
			text: ['0'],
			children:['testChart']
		},
		'testChart': {
			type: "chart",
			method: getChartData,
			children:['userAgree']
		}

	};

  
  return {
    getOnboarding: function(type) {
      //return conversationData[type];
      return treeData;
    }
  }
}]);
