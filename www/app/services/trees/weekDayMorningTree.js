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

		healthKitService.getCombinedTimesOfDayAverages().then(function(response){
			var result = 50;
			if(result > 50){
				deferred.resolve(treeData['aboveAvg']);
			}else {
				deferred.resolve(treeData['belowAvg']);	
			}
			
		});

		return deferred.promise;

	};


	var comparePreviousToDailyAvg = function(){
		var deferred = $q.defer();

		healthKitService.getCombinedTimesOfDayAverages().then(function(response){
			var result = 50;
			if(result > 50){
				deferred.resolve(treeData['previousDayCommentMore']);
			}else {
				deferred.resolve(treeData['previousDayCommentLess']);	
			}
			
		});

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

		'wkDayMorningRoot' : {
			text: ['53','54','55'],
			children: ['dataCollectMsg']
		},

		'dataCollectMsg' : {
			text: ['56','57','58'],
			//children: ['loggedMins']
			children: ['aboveAvg'] // to be removed...
		},

		// NEED to FIX the below 2 nodes...
		'loggedMins' : {
			text: ['59'],
			type: 'replacer',
			method: commonFunc.loggedInTimeSoFar,
			children:['compareToDailyAvg']
		},

		// IS THIS NEEDED ?
		'showChart': {
			type: "chart",
			//method: healthKitQueryFactory.getDailyAverageVsUsersChart,
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
			//children: ['loggedMins']
			children: ['aboveAvgMore']
		},

		'aboveAvgMore' : {
			text: ['62', '63'],
			//children: ['loggedMins']
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
			//children: ['previousDayCalc']
			children: ['previousDayCommentMore'] // to be removed
		},


		'previousDayCalc' : {
			text: ['69', '70'],
			type: 'replacer',
			method: commonFunc.loggedInTimeSoFar,
			children:['comparePreviousDayToAvg']
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