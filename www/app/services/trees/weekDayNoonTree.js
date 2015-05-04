angular.module('app.utils')

.factory('wkDayNoonTree', [
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


	
	var treeData = {
		
		'skeletonWaitNode' : {
			wait : true,
		},

		'userInputPlaceHolder' : {
			type: "user",
			wait : false
		},

		'wkDayNoonRoot' : {
			text: ['82','88','89' ,'90', '91'],
			children: ['dataCollectMsg']
		},

		'dataCollectMsg' : {
			text: ['56','57','58'],
			children: ['loggedMins']
		},

		'loggedMins' : {
			text: ['59', '92', '93'],
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


		'aboveAvg' : {
			text: ['60', '61'],
			children: ['aboveAvgMore']
		},

		'aboveAvgMore' : {
			text: ['62', '63', '94', '95', '96'],
			//children: ['lookPreviousDay'],
			children : ['userResAboveAvg']
		},

		'userResAboveAvg' : {
			text: ['15', '100', '101', '102'],
			type: "user",
			children: ['askLunchSuggest']
		},

		'askLunchSuggest' : {
			text: ['103'],
			children: ['userResYesAskLunchSuggest', 'userResNoAskLunchSuggest']
		},


		'userResYesAskLunchSuggest' : {
			text: ['38'],
			type: 'user',
			children: ['lunchTip1']

		},

		'lunchTip1' : {
			text: ['104'],
			children: ['lunchTip2']

		},

		'lunchTip2' : {
			text: ['105'],
			children: ['lunchTip3']

		},

		'lunchTip3' : {
			text: ['106'],
			children: ['userGoodToKnow']

		},

		'userGoodToKnow' : {
			text: ['83'],
			type: "user",
			children: ['closeNoonTree']
		},

		'closeNoonTree' : {
			text: ['84','85'],
			children: []
		},


		'userResNoAskLunchSuggest' : {
			text: ['39'],
			type: 'user',
			children: ['closeNoonTree']

		},

		'belowAvg' : {
			text: ['86', '87', '97', '98', '99'],
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
			children: ['tipToBeMoreActive']
		},

		'tipToBeMoreActive' : {
			text: ['107'],
			children: ['askLunchSuggest']
		}

	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayNoonRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);