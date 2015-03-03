angular.module('app.services')

/**
 * A simple example service that returns some data.
 */
.factory('talky', function() {

	var treeData = {
		root: ['onboarding', 'onboardingInfo'],
		'onboarding' : {
			text: "Hi There! I am wall-e",
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
			text: "Hi {{name}}! Nice to meet you",
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
			children: []
		},
		'onboardingInfoUserNo': {
			text: "No Thanks",
			type: "user",
			children: []
		}

	};

  
  return {
    getOnboarding: function(type) {
      //return conversationData[type];
      return treeData;
    }
  }
});