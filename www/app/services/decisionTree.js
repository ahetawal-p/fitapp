angular.module('app.services')

/**
 * A simple example service that returns tree data for conversation
 */
.factory('talky', ['healthKitService', '$q', '$ionicPlatform', 'chartConfigFactory',
function(healthKitService, $q, $ionicPlatform, chartConfigFactory) {

	
	$ionicPlatform.ready(function() {
		var colorConfig = {
					"0" : ['120deg', '#FFCC99', '#CCCC99'],
					"1" : ['-45deg', '#FFCC99', '#6633CC'],
					"2" : ['-92deg', '#CCCC99', '#6633FF'],
					"3" : ['50deg',  '#33FFFF', '#9999CC'],
					"4" : ['100deg', '#CC9999', '#CC99FF']
				};

		var randomColor = Math.floor((Math.random() * 5));
		var radomDirection = Math.floor((Math.random() * 2));
		var stylingStringLinear = "-webkit-linear-gradient(" +
					colorConfig[randomColor][0] + "," +
					colorConfig[randomColor][1] + "," +
					colorConfig[randomColor][2] +  ")";
	
		var stylingStringRadial = "-webkit-radial-gradient(" +
					colorConfig[randomColor][1] + "," +
					colorConfig[randomColor][2] + ")";

		var styleConfig = [stylingStringLinear, stylingStringRadial];

		console.log("Color: " + randomColor);
		console.log("Dir: " + radomDirection);

		jQuery(".scroll-content").css('background', styleConfig[radomDirection]);

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
			text: [0],
			children: ['askName']
		},
		'askName': {
			text: ['1'],
			children: ['userName']
		},
		'userName': {
			text: "TODO UPDATE > My Name is User",
			type: "user",
			children: ['greetUser']
		},
		'greetUser': {
			text: ['2'],
			evalInfo : {
				type : "string",
			},
			children: ['lookData']
		},
		'lookData':{
			text: ['3'],
			children: ['includeHApp']
		},
		'includeHApp':{
			text: ['4'],
			children:['askWouldLike']
		},
		'askWouldLike': {
			text: ['5'],
			children:['userAgree', 'userExplain']
		},
		'userAgree': {
			text: ['6'],
			type: "user",
			children: ['onboardingInfo']
		},
		'userExplain':{
			text: ['7'],
			type: "user",
			children: ['onboardingInfo']
		},
		'onboardingInfo': {
			text: ['8'],
			children:['moreOnboardingInfo']
			//children: ['aboveAverage']
		},
		'moreOnboardingInfo': {
			text: ['9'],
			children: ['furtherOnboardingInfo']
		},
		'furtherOnboardingInfo': {
			text: ['10'],
			children: ['onboardingInfoUserConfirm','onboardingInfoUserNo']
		},
		'onboardingInfoUserConfirm': {
			text: ['6'],
			type: "user",
			//children: ['dummyAnalyzer']
			children : ['openHealthApp']
		},
		'onboardingInfoUserNo': {
			text: ['11'],
			type: "user",
			children: ['collectInfo']
		},

		'collectInfo': {
			text: ['12'],
			children: ['whenReady']
		},
		'whenReady': {
			text: ['13'],
			children: ['gotoSettings']
		},
		'gotoSettings': {
			text: ['14'],
			children: ['gotoSettingsOk']
		},
		'gotoSettingsOk': {
			text: ['15'],
			type: "user",
			children: ['lookingForward']
		},
		'lookingForward': {
			text: ['16'],
			children: []
		},

		'openHealthApp': {
			text: "FIX ME : NEED TO OPEN Health App here...",
			children: ['addDataHApp']
		},
		'addDataHApp': {
			text: ['17'],
			children: ['addDataOk']
		},
		'addDataOk': {
			text: ['15'],
			type: "user",
			children: ['activityOnPhone']
		},
		'activityOnPhone': {
			text: ['18'],
			children: ['activityOnPhoneOk', 'activityOnPhone1']
		},
		'activityOnPhoneOk': {
			text: ['15'],
			type: "user",
			children: ['dummyAnalyzer']
		},
		
		'activityOnPhone1': {
			text: ['19'],
			type: "user",
			children: ['activityOnPhoneExplain']
		},

		'activityOnPhoneExplain': {
			text: ['20'],
			children: ['activityOnPhoneExplainMore']
		},

		'activityOnPhoneExplainMore': {
			text: ['21'],
			children: ['activityOnPhoneIsee']
		},

		'activityOnPhoneIsee': {
			text: ['22'],
			type: "user",
			children: ['activityOnPhoneLookData']
		},

		'activityOnPhoneLookData': {
			text: ['23'],
			children: ['activityOnPhoneSure', 'activityOnPhoneNotNow']
		},

		'activityOnPhoneSure': {
			text: ['24'],
			type: "user",
			children: ['dummyAnalyzer']
		},
		'activityOnPhoneNotNow': {
			text: ['25'],
			type: "user",
			children: []
		},
		
		'dummyAnalyzer' : {
			evalInfo : {
				type : "func",
				method : testMethod,
			},
			children:[]
		},
		'aboveAverage':{
			text: ['26'],
			children:['moreActiveTip']
		},
		'onParAverage':{
			text: ['27'],
			children:['moreActiveTip']
		},
		'belowAverage': {
			text: ['28'],
			children:['moreActiveTip']
		},
		'moreActiveTip': {
			text: ['29'],
			children:['testChart']
		},
		'testChart': {
			type: "chart",
			method: getChartData,
			children:[]
		}

	};

  
  return {
    getOnboarding: function(type) {
      //return conversationData[type];
      return treeData;
    }
  }
}]);
