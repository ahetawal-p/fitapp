angular.module('app.builders')

.factory('groupedActivityBuilder', 
	function() {

	var currentGroupedActivity;
    function createGroupedActivity(startDate){
        currentGroupedActivity = {};
        currentGroupedActivity.startDate = startDate;
        console.log("createGroupedActivity: startDate " + currentGroupedActivity.startDate );
        currentGroupedActivity.distance = 0;
    }

    function addDistance(distance){
	    currentGroupedActivity.distance += distance;
    }

    function getGroupedActivity(endDate){
        currentGroupedActivity.endDate = endDate;    
        console.log("createGroupedActivity: endDate " + currentGroupedActivity.endDate );
    
    	return currentGroupedActivity;
    }

    function clearGroupedActivity(){
    	currentGroupedActivity = {};
    }

  return {
    createGroupedActivity: createGroupedActivity,
    addDistance: addDistance,
    getGroupedActivity: getGroupedActivity,
    clearGroupedActivity: clearGroupedActivity
      };
});