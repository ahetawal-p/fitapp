angular.module('app.utils')

.factory('wkDayLateNiteTree', [
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

		'wkDayLateNiteRoot' : {
			text: ['129', '130', '131'],
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
			children: ['closeLateNiteTree']
		},

		
		'closeLateNiteTree' : {
			text: ['85', '126', '127'],
			children: []
		},

		
		'belowAvg' : {
			text: ['133', '134', '135'],
			children: ['closeLateNiteTree']
		}


	};


	return {
		getTree : function() {
    		return {
	    		rootType : 'wkDayLateNiteRoot',
	    		allNodes : treeData
	    	};
    	}
	}




	}]);