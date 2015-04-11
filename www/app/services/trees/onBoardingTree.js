angular.module('app.utils')

.factory('onboardingTree', [
	'healthKitService', 
	'$q', 
	'chartConfigFactory', 
	'$ionicPopup', 
	'$localstorage', 
	'$translate', 
	'healthKitQueryFactory',
	'dateTimeUtil',
	'commonFunc',
	function(healthKitService, 
			$q, 
			chartConfigFactory, 
			$ionicPopup, 
			$localstorage, 
			$translate, 
			healthKitQueryFactory,
			dateTimeUtil,
			commonFunc) {

	var compareWeekdayWeekends = function(){
		var deferred = $q.defer();

		healthKitService.getWeekdayWeekendAverages().then(function(chartDataContainer){
				var weekday = chartDataContainer.dataSets[0].data[0];
				var weekend = chartDataContainer.dataSets[0].data[1];
				var diff = weekday - weekend;
				var denominator = weekend == 0 ? weekday : weekend;
				/* handle case where both weekend and weekday activities are 0 */
				if (denominator == 0){
					deferred.resolve(treeData['weekdayEqualWeekends']);
				}

				var percentDiff = diff/denominator * 100;

				if(percentDiff > 5){
					deferred.resolve(treeData['weekdayMoreWeekends']);
				}else if(percentDiff < -5){
					deferred.resolve(treeData['weekdayLessWeekends']);
				}else{
					deferred.resolve(treeData['weekdayEqualWeekends']);
				}
		});

		return deferred.promise;
	}


	var compareWeekdayWeekendsComments = function(){
		var deferred = $q.defer();

		var weekdayOrWeekendActive = healthKitService.getWeekdayOrWeekendActive();
		if (weekdayOrWeekendActive === "weekday"){
			deferred.resolve(treeData['weekdayWarrior']);
		} else if (weekdayOrWeekendActive === "weekend"){
			deferred.resolve(treeData['weekendWarrior']);			
		} else {
			deferred.resolve(treeData['weekdayEqualWeekendWarrior']);
		}

		return deferred.promise;
	}

	var compareAvgMinutesWithUsers = function() {
		var deferred = $q.defer();

		healthKitService.getDailyAverageDuration().then(function(minutes){
				if(minutes > 50){
					deferred.resolve(treeData['aboveAverage']);
				}else if(minutes == 50){
					deferred.resolve(treeData['onParAverage']);
				}else{
					deferred.resolve(treeData['belowAverage']);
				}
		});

		return deferred.promise;
	};

	var checkHealthKitExists = function(){
		var deferred = $q.defer();

		healthKitService.checkHealthKitExists().then(function(exists){
			if (exists){
				deferred.resolve(treeData['askName']);
			} else {
				/* MODIFY THIS IN PRODUCTION TO RETURN healthKitNotExist node */
				//deferred.resolve(treeData['healthKitNotExist']);
				deferred.resolve(treeData['askName']);
			}
		});

		return deferred.promise;
	}

	var requestAuthorization = function(){
		var deferred = $q.defer();

		healthKitService.requestAuthorization().then(function(response){
			deferred.resolve(treeData['addDataHApp']);
		}, function(err){
			deferred.resolve(treeData['addDataHApp']);
		});

		return deferred.promise;
	}

	var userInputPopup = function(myScope){
		var deferred = $q.defer();
		if($localstorage.getUser() != null){
			deferred.resolve(treeData['greetUser']);
  		} else {
  			$translate('Enter_Name').then(function (enterNameMsg) {
	  			var myPopup = $ionicPopup.show({
			    template: '<input type="text" ng-model="user.nickname">',
			    title: enterNameMsg,
			    cssClass: 'myPopup',
			    scope: myScope,
			    buttons: [
			      {
			        text: '<b>Ok</b>',
			        type: 'button-energized',
			        onTap: function(e) {
			          if (!myScope.user.nickname) {
			            //don't allow the user to close unless he enters a name
			            e.preventDefault();
			          } else {
			          	$localstorage.setObject("user", myScope.user);
			            return treeData['greetUser'];
			          }
			        }
			      }
			    ]
			  	});
		  		myPopup.then(function(response){
						deferred.resolve(response);
					},
					function(error){
						deferred.reject(error);
					}
				);
			});

  		}
  		return deferred.promise;
	};



	var treeData = {
		
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
			children: ['checkHealthKitExists']
			// children: ['askName']
		},

		'checkHealthKitExists' : {
			evalInfo : {
				type : "func",
				method : checkHealthKitExists,
			},
			children:[]
		},
		'healthKitNotExist': {
			text: ['52'],
			children: []
		},		
		'askName': {
			text: ['1'],
			children: ['userInput']
		},

		'userInput': {
			evalInfo : {
				type : "func",
				method : userInputPopup,
			},
			children:[]
		},

		'userName': {
			text: "TODO UPDATE > My Name is User",
			type: "user",
			children: ['lookData']
		},

		'greetUser': {
			text: ['2'],
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
			evalInfo : {
				type : "func",
				method : requestAuthorization,
			},
			children:[]
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
			children: ['averageMinutesPerDay']
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
			children: ['averageMinutesPerDay']
		},
		'activityOnPhoneNotNow': {
			text: ['25'],
			type: "user",
			children: ['thatsAllIHave']
		},
		
		'aboveAverage':{
			text: ['26'],
			children:['dailyAvgVsUsersBarChart']
		},
		'onParAverage':{
			text: ['27'],
			children:['dailyAvgVsUsersBarChart']
		},
		'belowAverage': {
			text: ['28'],
			children:['dailyAvgVsUsersBarChart']
		},
		'moreActiveTip': {
			text: ['29'],
			children:['percentOfDayOnButt']
		},
		'averageMinutesPerDay': {
			text: ['30'],
			type: 'replacer',
			method: commonFunc.calculateAverageMinsPerDay,
			children:['minutesToMoon']
		},
		'minutesToMoon': {
			text: ['31'],
			type: 'replacer',
			method: commonFunc.calculateYearsToMoon,
			children:['minutesPrettyGood']
		},
		'minutesPrettyGood': {
			text: ['32'],
			type: 'replacer',
			method: commonFunc.calculateAverageMinsPerDay,
			children:['minutesPrettyGoodHa']
		},
		'minutesPrettyGoodHa': {
			text: ['33'],
			type: 'user',
			children:['avgMinutesVsUsers']
		},
		"avgMinutesVsUsers": {
			evalInfo : {
				type : "func",
				method : compareAvgMinutesWithUsers
			},
			children:[]
		},
		"percentOfDayOnButt": {
			text: ['34'],
			type: 'replacer',
			method: commonFunc.calculatePercentOnButt,
			children:['percentOfDayOnButtWow']
		},
		"percentOfDayOnButtWow": {
			text: ['35'],
			type: 'user',
			children:['concludeAssessment']
		},
		"concludeAssessment": {
			text: ['36'],
			children:['askToShowMoreDetails']
		},
		"askToShowMoreDetails": {
			text: ['37'],
			children:['showMoreDetailsYes', 'showMoreDetailsNo']
		},
		"showMoreDetailsYes": {
			text: ['38'],
			type: 'user',
			children:['compareWeekdayWeekends']
		},
		"showMoreDetailsNo": {
			text: ['39'],
			type: 'user',
			children:[]
		},	
		"compareWeekdayWeekends": {
			evalInfo : {
				type : "func",
				method : compareWeekdayWeekends
			},
			children:[]
		},	
		"weekdayMoreWeekends": {
			text: ['40'],
			children:['weekdayVsWeekendBarChart']
		},
		"weekdayEqualWeekends": {
			text: ['41'],
			children:['weekdayVsWeekendBarChart']
		},
		"weekdayLessWeekends": {
			text: ['42'],
			children:['weekdayVsWeekendBarChart']
		},
		"weekdayVsWeekendComment": {
			evalInfo : {
				type : "func",
				method : compareWeekdayWeekendsComments
			},
			children:[]			
		},
		"weekdayWarrior": {
			text: ['43'],
			children:['weekdayVsWeekendCommentThanks']
		},	
		"weekendWarrior": {
			text: ['44'],
			children:['weekdayVsWeekendCommentThanks']
		},	
		"weekdayEqualWeekendWarrior": {
			text: ['45'],
			children:['weekdayVsWeekendCommentThanks']
		},	
		"weekdayVsWeekendCommentThanks": {
			text: ['46'],
			type: 'user',
			children:['displayMostActiveTimeOfWeek']
		},
		"displayMostActiveTimeOfWeek": {
			text: ['47'],
			type: 'replacer',
			method: commonFunc.mostActiveTimeOfWeek,
			children:['displayMostActiveTimeOfWeekDuration']
		},
		"displayMostActiveTimeOfWeekDuration": {
			text: ['48'],
			type: 'replacer',
			method: commonFunc.mostActiveTimeOfWeekDuration,
			children:['powerHour']
		},
		"powerHour": {
			text: ['49'],
			type: 'replacer',
			method: commonFunc.powerHour,
			children:['thatsAllIHave']
		},
		"thatsAllIHave": {
			text: ['50'],
			children:['keepBringingPhone']
		},
		"keepBringingPhone": {
			text: ['51'],
			children:['introTreeEndOk']
		},
		"introTreeEndOk": {
			text: ['15'],
			type: "user",
			children:[]
		},
		'yesterdayVsAvgLineChart': {
			type: "chart",
			method: healthKitQueryFactory.getYesterdayVsAverageChartConfig,
			children:[]
		},
		'dailyAvgVsUsersBarChart': {
			type: "chart",
			method: healthKitQueryFactory.getDailyAverageVsUsersChart,
			children: ['moreActiveTip']
		},
		'lastVsPrevBarChart': {
			type: "chart",
			method: healthKitQueryFactory.getLastPreviousWeeksAvgerageChart,
			children: []
		},
		'weekdayVsWeekendBarChart': {
			type: "chart",
			method: healthKitQueryFactory.getWeekdayVsWeekendChart,
			children: ['weekdayVsWeekendComment']
		}

	};




	return {
    	getTree : function() {
	    	return {
		    	rootType : 'onboarding',
		    	allNodes : treeData
		    };
	    }
  	}


}]);
