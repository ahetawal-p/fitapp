// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('fitapp', [
            'ionic',
            'angular.filter',
            'app.activity.parent',
            'app.conversation',
            'app.services'
                        //'app.home',
            //'app.settings'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "app/home/apptabs.html"
  })

  
  .state('tab.activityList', {
    url: '/activityList',
    views: {
      'activityContent': {
        templateUrl: 'app/activity/home/list/activityList.html'
      }
    }
  })
  .state('tab.activityChart', {
    url: '/activityChart',
    views: {
      'activityContent': {
        templateUrl: 'app/activity/home/chart/activityChart.html'
      }
    }
  })  

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'app/settings/settings.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/conversation');

<!--
<!--
});
