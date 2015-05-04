angular.module('app.utils')

.factory('wkDayMorningTree', [
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


	var compareCurrentToDailyAvg = function(){
		var deferred = $q.defer();
		var startDate, endDate;
		startDate = moment();
       	startDate.hours(0);
       	startDate.minutes(0); // 00:00 hours
       	endDate = moment(); // right now

       	healthKitService.getDateVsAverageDuration(startDate, endDate).then(function(response){
			var today = response['todayData'];
			var avgData = response['avgData'];
			if(today >= avgData && today > 0){
				deferred.resolve(treeData['aboveAvg']);
			} else {
				deferred.resolve(treeData['belowAvg']);	
			}
			
		});

		return deferred.promise;

	};


	var comparePreviousToDailyAvg = function(){
		var deferred = $q.defer();
		var startDate, endDate;
		startDate = moment().subtract(1, "day");
       	startDate.hours(0);
       	startDate.minutes(0); // 00:00 hours
       	endDate = moment().subtract(1, "day"); // yesterday end
       	endDate.hours(23);
       	endDate.minutes(59);

       	healthKitService.getDateVsAverageDuration(startDate, endDate).then(function(response){
			var today = response['todayData'];
			var avgData = response['avgData'];
			var minString = '0 ' + $translate.instant("Minute_Text");
			if(today == minString) {
				deferred.resolve(treeData['noAvg']);
			} else if(today >= avgData){
				deferred.resolve(treeData['previousDayCommentMore']);
			} else {
				deferred.resolve(treeData['previousDayCommentLess']);	
			}
			
		});

		return deferred.promise;


	};


	var treeData = {
		
		'skeletonWaitNode' : {
			wait : true,
		},

		'userInputPlaceHolder' : {
			type: "user",
			wait : false
		},

		'wkDayMorningRoot' : {
			text: ['53','54','55'],
			children: ['dataCollectMsg']
		},

		'dataCollectMsg' : {
			text: ['56','57','58'],
			children: ['loggedMins']
		},

		'loggedMins' : {
			text: ['59'],
			type: 'replacer',
			method: commonFunc.loggedInTimeSoFar,
			children:['showChart']
		},

		'showChart': {
			type: "chart",
			method: healthKitQueryFactory.getTodayVsAverageChartConfig,
			children: ['compareToDailyAvg']
		},


		'compareToDailyAvg': {
			evalInfo : {
				type : "func",
				method : compareCurrentToDailyAvg,
			},
			children:[]
		},


		'noAvg' : {
			text: ['81'],
			children: ['closeMorningTree']

		},

		'aboveAvg' : {
			text: ['60', '61'],
			children: ['aboveAvgMore']
		},

		'aboveAvgMore' : {
			text: ['62', '63'],
			children: ['lookPreviousDay']
		},

		'belowAvg' : {
			text: ['86', '87'],
			children: ['askUserBusy', 'askUserOnBreak']
		},

		'askUserBusy': {
			text: ['65'],
			type: "user",
			children: ['isee']
		},

		'askUserOnBreak':{
			text: ['66'],
			type: "user",
			children: ['isee']
		},

		'isee' : {
			text: ['22'],
			children: ['lookPreviousDay']
		},

		'lookPreviousDay' : {
			text: ['67', '68'],
			children: ['showPreviousDayChart'] 
		},


		// 'previousDayCalc' : { REMOVED DUE TO 0 MIN CHECK
		// 	text: ['69', '70'],
		// 	type: 'replacer',
		// 	method: commonFunc.loggedInTimeYesterday,
		// 	children:['showPreviousDayChart']
		// },


		'showPreviousDayChart': {
			type: "chart",
			method: healthKitQueryFactory.getYesterdayVsAverageChartConfig,
			children: ['comparePreviousDayToAvg']
		},


		'comparePreviousDayToAvg' : {
			evalInfo : {
				type : "func",
				method : comparePreviousToDailyAvg,
			},
			children:[]
		},

		'previousDayCommentMore' : {
			text: ['71', '72'],
			children: ['brkfstTip']

		},

		'previousDayCommentLess' : {
			text: ['74'],
			children: ['previousDayCommentLessNoWorries']
			
		},

		'previousDayCommentLessNoWorries' : {
			text: ['81'],
			children: ['brkfstTip']
			
		},

		'brkfstTip' : {
			text: ['75'],
			children: ['userBrkfstYes','userBrkfstNow','userBrkfstNo']

		},

		'userBrkfstYes' : {
			text: ['38'],
			type: "user",
			children: ['yesOrEatingBskfst']
		},

		'userBrkfstNow' : {
			text: ['76'],
			type: "user",
			children: ['yesOrEatingBskfst']
		},

		'userBrkfstNo' : {
			text: ['39'],
			type: "user",
			children: ['noBrkfst']
		},
		
		'yesOrEatingBskfst' : {
			text: ['77'],
			children: ['yesOrEatingBskfstMore']

		},

		'yesOrEatingBskfstMore' : {
			text: ['78'],
			children: ['yesOrEatingBskfstMore2']

		},

		'yesOrEatingBskfstMore2' : {
			text: ['79'],
			children: ['userGoodToKnow']

		},

		'noBrkfst' : {
			text: ['80'],
			children: ['yesOrEatingBskfstMore']
		},

		'userGoodToKnow' : {
			text: ['83'],
			type: "user",
			children: ['closeMorningTree']
		},

		'closeMorningTree' : {
			text: ['84','85'],
			children: []
		}

	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayMorningRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);