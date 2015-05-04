angular.module('app.utils')

.factory('wkDayEveTree', [
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

		'wkDayEveRoot' : {
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
			children: ['askDinnerSuggest']
		},

		'askDinnerSuggest' : {
			text: ['118'],
			children: ['userResYesAskDinnerSuggest', 'userResNoAskDinnerSuggest', 'userResNowAskDinnerSuggest']
		},


		'userResYesAskDinnerSuggest' : {
			text: ['38'],
			type: "user",
			children: ['dinnerTip1']

		},

		'userResNowAskDinnerSuggest' : {
			text: ['76'],
			type: "user",
			children: ['dinnerTip1']

		},

		'dinnerTip1' : {
			text: ['120'],
			children: ['userGoodToKnow']

		},

		
		'userGoodToKnow' : {
			text: ['83'],
			type: "user",
			children: ['closeEveTree']
		},

		'closeEveTree' : {
			text: ['85', '128'],
			children: []
		},


		'userResNoAskDinnerSuggest' : {
			text: ['119'],
			type: 'user',
			children: ['userNoDinnerTip1']

		},

		'userNoDinnerTip1' : {
			text: ['121'],
			children: ['userGoodToKnow']

		},

		'belowAvg' : {
			text: ['86', '87', '97', '98', '99'],
			children: ['askDinnerSuggest']
		}





	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayEveRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);