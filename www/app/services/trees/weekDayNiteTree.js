angular.module('app.utils')

.factory('wkDayNiteTree', [
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

		'wkDayNiteRoot' : {
			text: ['132','88','89' ,'90', '91'],
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
			children: ['askSleepSuggest']
		},

		'askSleepSuggest' : {
			text: ['122'],
			children: ['userResYesAskSleepSuggest', 'userResRarelyAskSleepSuggest']
		},


		'userResYesAskSleepSuggest' : {
			text: ['38'],
			type: "user",
			children: ['sleepTip1']

		},

		'userResRarelyAskSleepSuggest' : {
			text: ['123'],
			type: "user",
			children: ['userNoSleepTip1']

		},

		'sleepTip1' : {
			text: ['124'],
			children: ['userGoodToKnow']

		},

		
		'userGoodToKnow' : {
			text: ['83'],
			type: "user",
			children: ['closeEveTree']
		},

		'closeEveTree' : {
			text: ['85', '126', '127'],
			children: []
		},


		'userNoSleepTip1' : {
			text: ['125'],
			children: ['userGoodToKnow']

		},

		'belowAvg' : {
			text: ['86', '87', '97', '98', '99'],
			children: ['askSleepSuggest']
		}

		



	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayNiteRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);