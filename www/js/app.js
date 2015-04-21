// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('fitapp', [
            'ionic',
            'angular.filter',
            'app.login',
            'app.activity.parent',
            'app.activity.create',
            'app.activity.update',
            'app.conversation',
            'app.settings',
            'ngCordova',
            'underscore',
            'highcharts-ng',
            'pascalprecht.translate',
            'ngCookies'
            
])

.run(function($ionicPlatform, $cordovaHealthKit, $rootScope, $localstorage) {
  $ionicPlatform.ready(function() {
        console.log($localstorage.getUser());
  });
})

.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$localstorageProvider',
        function($stateProvider, $urlRouterProvider, $translateProvider, $localstorageProvider) {

    
    $translateProvider.useStaticFilesLoader({
      prefix: 'language/',
      suffix: '.json'
    });
   $translateProvider.preferredLanguage('en_US');

   $translateProvider.useLocalStorage();

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // var myname = $localstorageProvider.$get().getUser().name;

  $stateProvider
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: function() {
                         // if(myname == "Amit1") {
                              return 'app/home/apptabs.html';
                          //  }else {
                          //   return 'app/home/apptabs_new.html';
                          //  }
                        }
   // templateUrl: "app/home/apptabs.html"
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/login/login.html'
    }
  );

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/conversation');

   $urlRouterProvider.otherwise('/login');
<!--
<!--
}]);
