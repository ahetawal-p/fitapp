// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('fitapp', [
            'ionic',
            'angular.filter',
            'app.activity.parent',
            'app.activity.create',
            'app.activity.update',
            'app.conversation',
            'app.settings',
            'ngCordova',
            'underscore',
            'chart.js'
])

.run(function($ionicPlatform, $cordovaHealthKit, $rootScope) {
  $ionicPlatform.ready(function() {
    // // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   StatusBar.styleDefault();
    // }

    //Ask/set user permissions for Healthkit data
    try{
    $cordovaHealthKit.isAvailable().then(function(yes) {
    // HK is available
        $rootScope.healthkitExists = true;

        var permissions = [
        'HKQuantityTypeIdentifierDistanceWalkingRunning',
        'HKCategoryValueSleepAnalysisAsleep'];
     
        $cordovaHealthKit.requestAuthorization(
            permissions, // Read permission
            permissions // Write permission
        ).then(function(success) {
            // store that you have permissions

        }, function(err) {
            // handle error
        });
     
        }, function(no) {
            // No HK available
        }); 
  }catch (exception){
    $rootScope.healthkitExists = false;
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
  });

  
  // .state('tab.activityList', {
  //   url: '/activityList',
  //   views: {
  //     'activityContent': {
  //       templateUrl: 'app/activity/parent/list/activityList.html'
  //     }
  //   }
  // })
  // .state('tab.activityChart', {
  //   url: '/activityChart',
  //   views: {
  //     'activityContent': {
  //       templateUrl: 'app/activity/parent/chart/activityChart.html'
  //     }
  //   }
  // });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/conversation');

<!--
<!--
});
