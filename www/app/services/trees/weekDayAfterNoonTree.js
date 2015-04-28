angular.module('app.utils')

.factory('wkDayAfterNoonTree', [
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
			if(today >= avgData){
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

		'wkDayAfterNoonRoot' : {
			text: ['108','88','89' ,'90', '91'],
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
			children: ['askWalkSuggest']
		},

		'askWalkSuggest' : {
			text: ['109'],
			children: ['userResYesAskWalkSuggest', 'userResNoAskWalkSuggest']
		},


		'userResYesAskWalkSuggest' : {
			text: ['110'],
			type: 'user',
			children: ['walkTip1']

		},

		'walkTip1' : {
			text: ['112'],
			children: ['walkTip2']

		},

		'walkTip2' : {
			text: ['113'],
			children: ['walkTip3']

		},

		'walkTip3' : {
			text: ['114'],
			children: ['userGoodToKnow']

		},

		'userGoodToKnow' : {
			text: ['83'],
			type: "user",
			children: ['closeAfterNoonTree']
		},

		'closeAfterNoonTree' : {
			text: ['84','85'],
			children: []
		},


		'userResNoAskWalkSuggest' : {
			text: ['111'],
			type: 'user',
			children: ['userNoResTip1']

		},

		'userNoResTip1' : {
			text: ['115'],
			children: ['userNoResTip2']

		},

		'userNoResTip2' : {
			text: ['116'],
			children: ['userNoResTip3']

		},

		'userNoResTip3' : {
			text: ['117'],
			children: ['userGoodToKnow']

		},


		'belowAvg' : {
			text: ['86', '87', '97', '98', '99'],
			children: ['askWalkSuggest']
		}


	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayAfterNoonRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);