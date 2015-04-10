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
	function( 
			$ionicPlatform, 
			$localstorage, 
			$translate, 
			dateTimeUtil,
			onboardingTree
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
    		if(dayName != 'SUNDAY' && dayName !='SATURDAY') {
		    	 if(currentHour >=5 && currentHour < 12){ // 5am - 12pm
		    		return onboardingTree.getTree();
		    	} else if(currentHour >=12 && currentHour < 17){ // 12pm - 5pm
		    		return onboardingTree.getTree();
		    	} else if(currentHour >=17 && currentHour < 21) { //5pm - 9pm
		    		return onboardingTree.getTree();
		    	} else if(currentHour >=21 || currentHour < 5) {
		    		return onboardingTree.getTree();
		    	}
	    	} else {
	    		return onboardingTree.getTree();
	    	}
	    }
    }

  }
  
}]);
