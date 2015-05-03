angular.module('app.services.stubs')

/**
 * A simple example service that returns some data.
 */
.factory('stubService', function() {
  // Might use a resource here that returns a JSON array

        var activities = JSON.parse('[{"date": "2015-02-09", "length": "15 min", "activityType": "walk", "description": "0.5 miles, 80 cal", "timeStamp": "17:00", "icon": "ion-fireball"},{"date": "2015-02-10", "length": "7 hr 30 min", "activityType": "sleep", "description": "00:33 - 08:01", "timeStamp": "00:33", "icon": "ion-ios7-moon"}, {"date": "2015-02-09", "length": "7 hr 5 min", "activityType": "sleep", "description": "01:00 - 08:04", "timeStamp": "01:00", "icon": "ion-ios7-moon"},{"date": "2015-02-12", "length": "7 hr 5 min", "activityType": "sleep", "description": "01:00 - 08:04", "timeStamp": "01:00", "icon": "ion-ios7-moon"},{"date": "2015-02-08", "length": "7 hr 5 min", "activityType": "walk", "description": "0.7 miles, 120 cal", "timeStamp": "16:00", "icon": "ion-fireball"}]');

        var activityTypes = JSON.parse('[{"activityType": "walk", "icon": "ion-leaf"}, {"activityType": "run", "icon": "ion-waterdrop"}, {"activityType": "bike", "icon": "ion-flame"}, {"activityType": "workout", "icon": "ion-fireball"}, {"activityType": "sports", "icon": "ion-bonfire"}, {"activityType": "sleep", "icon": "ion-ios7-moon"}]');

        var messages = [
            { content: '<p>Nice to have you back so soon!</p>' },
            { content: '<p>You\'re coming in at 5 minutes so far.</p>' },
            { content: '<p>Not quite where you usually are on weekdays</p>' },
            { content: '<p>As you noted, you\'ve been busy today!</p>' },
            { content: '<p>Hope your busy day went well!</p>' },
            { content: '<p>Am I dreaming?</p>' }
          ]; 

        var userMessages = [
            {content: '<p>OK</p>'},
            {content: '<p>Yup</p>'},
            {content: '<p>Sure</p>'},
            {content: '<p>Alright</p>'}
        ];

        var goalTypes = JSON.parse('[{"goalTypeId": 0, "goalType": "Getting fitter", "checked": true}, {"goalTypeId": 1, "goalType": "Staying healthy and happy", "checked": false}, {"goalTypeId": 2, "goalType": "Weight loss", "checked": false}]');
        var activity = JSON.parse('{}');

  return {
    getActivities: function() {
      return activities;
    },
    getActivityTypes: function() {
      // Simple index lookup
      return activityTypes;
    },
    getActivity: function(){
    	return activity;
    },
    getGoalTypes: function(){
    	return goalTypes;
    }
  }
});