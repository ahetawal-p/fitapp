angular.module('app.services')

/**
 * A simple example service that returns tree data for conversation
 */
.factory('talky', [
	'$ionicPlatform', 
	'$localstorage', 
	'$translate', 
	'dateTimeUtil',
	'onboardingTree',
	'wkDayMorningTree',
	'wkDayNoonTree',
	'wkDayAfterNoonTree',
	'wkDayEveTree',
	'wkDayNiteTree',
	'wkDayLateNiteTree',
	function( 
			$ionicPlatform, 
			$localstorage, 
			$translate, 
			dateTimeUtil,
			onboardingTree,
			wkDayMorningTree,
			wkDayNoonTree,
			wkDayAfterNoonTree,
			wkDayEveTree,
			wkDayNiteTree,
			wkDayLateNiteTree
			) {


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

		jQuery(".conversationView > .scroll-content").css('background', styleConfig[radomDirection]);

	  });


	

	
  return {
    getConversationTree : function() {
    	var rootName = null;
    	var currentHour = dateTimeUtil.getCurrentHour();
    	var dayName = dateTimeUtil.getDayOfWeekName();
    	if($localstorage.getUser() == null){
    		return onboardingTree.getTree();
    	} else {
    		//if(dayName != 'SUNDAY' && dayName !='SATURDAY') {
		    	 if(currentHour >=6 && currentHour < 10){ // 6am - 10am
		    		return wkDayMorningTree.getTree();
		    	} else if(currentHour >=10 && currentHour < 14){ // 10am - 2pm
		    		return wkDayNoonTree.getTree();
		    	} else if(currentHour >=14 && currentHour < 17) { // 2pm - 5pm
		    		return wkDayAfterNoonTree.getTree();
		    	} else if(currentHour >=17 && currentHour < 21) { // 5pm - 9pm
		    		return wkDayEveTree.getTree();
		    	} else if(currentHour >=21 && currentHour < 24) { // 9pm - midnight
		    		return wkDayLateNiteTree.getTree();
		    	} else if(currentHour >=0 && currentHour < 5) { // midnight -  5am
		    		return wkDayLateNiteTree.getTree();
		    	}
	    	//} else {
	    	//	return onboardingTree.getTree();
	    	//}
	    }
    }

  }
  
}]);
