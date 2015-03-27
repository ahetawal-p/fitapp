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
			text: "Hi There I am wall-e",
			children: ['askName']
		},
		'askName': {
			text: "What is your name?",
			children: ['userName']
		},
		'userName': {
			text: "My Name is User",
			type: "user",
			children: ['greetUser']
		},
		'greetUser': {
			text: '"Hi " + user.name + "! Nice to meet you"',
			evalInfo : {
				type : "string",
			},
			children: ['lookData']
		},
		'lookData':{
			text: "Let's get started by taking a look at your existing data.",
			children: ['includeHApp']
		},
		'includeHApp':{
			text: "In my analysis, I can include data from your iPhone's Healthapp.",
			children:['askWouldLike']
		},
		'askWouldLike': {
			text: "Would you like that",
			children:['userAgree', 'userExplain']
		},
		'userAgree': {
			text:"Sounds Great",
			type: "user",
			children: ['onboardingInfo']
		},
		'userExplain':{
			text:"Please explain",
			type: "user",
			children: ['onboardingInfo']
		},
		'onboardingInfo': {
			text: "Your device will be personalized based on your workout, sleep, and nutrition data…",
			children:['moreOnboardingInfo']
		},
		'moreOnboardingInfo': {
			text: "Plus your height, weight, age and gender",
			children: ['furtherOnboardingInfo']
		},
		'furtherOnboardingInfo': {
			text: "Your data is safe, and will never be shared with anyone",
			children: ['onboardingInfoUserConfirm','onboardingInfoUserNo']
		},
		'onboardingInfoUserConfirm': {
			text: "Sounds great",
			type: "user",
			//children: ['dummyAnalyzer']
			children : ['openHealthApp']
		},
		'onboardingInfoUserNo': {
			text: "No Thanks",
			type: "user",
			children: ['collectInfo']
		},

		'collectInfo': {
			text: "Pokkifit will need to collet your data for analysis",
			children: ['whenReady']
		},
		'whenReady': {
			text: "Let me know when you are ready",
			children: ['gotoSettings']
		},
		'gotoSettings': {
			text: "You can go to settings and edit Health app permissions",
			children: ['gotoSettingsOk']
		},
		'gotoSettingsOk': {
			text: "Ok",
			type: "user",
			children: ['lookingForward']
		},
		'lookingForward': {
			text: "Looking forward to that",
			children: []
		},

		'openHealthApp': {
			text: "FIX ME : NEED TO OPEN Health App here...",
			children: ['addDataHApp']
		},
		'addDataHApp': {
			text: "Great. I'll add your Health data to my stats",
			children: ['addDataOk']
		},
		'addDataOk': {
			text: "Ok",
			type: "user",
			children: ['activityOnPhone']
		},
		'activityOnPhone': {
			text: "Let's take a look at the activity data stored on your iPhone",
			children: []
		},
		'activityOnPhoneOk': {
			text: "Ok",
			type: "user",
			children: ['dummyAnalyzer']
		},
		
		'activityOnPhone?': {
			text: "Stored on my phone?",
			type: "user",
			children: ['activityOnPhoneExplain']
		},

		'activityOnPhoneExplain': {
			text: "All iPhone have a motion sensor that detects and stores up to 7 days of your activities and sleep data",
			children: ['activityOnPhoneExplainMore']
		},

		'activityOnPhoneExplainMore': {
			text: "No one can see this info until you give permission, like you did with Po.",
			children: ['activityOnPhoneIsee']
		},

		'activityOnPhoneIsee': {
			text: "I see",
			type: "user",
			children: ['activityOnPhoneLookData']
		},

		'activityOnPhoneLookData?': {
			text: "Would you like to take a look at your data?",
			children: ['activityOnPhoneSure', 'activityOnPhoneNotNow']
		},

		'activityOnPhoneSure': {
			text: "Sure",
			type: "user",
			children: []
		},
		'activityOnPhoneNotNow': {
			text: "Not Now",
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
			text: "It beats the daily average for an average Joe",
			children:['moreActiveTip']
		},
		'onParAverage':{
			text: "You are on par with the average of Fitapp users",
			children:['moreActiveTip']
		},
		'belowAverage': {
			text: "It is slightly under the average of a typical Fitapp user.",
			children:['moreActiveTip']
		},
		'moreActiveTip': {
			text: "Consider this",
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
