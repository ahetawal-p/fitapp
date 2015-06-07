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

.run(function($ionicPlatform, $cordovaHealthKit, $rootScope, $localstorage, $window, $state, $translate) {
    $ionicPlatform.ready(function() {
        

        // Startup code...
        document.addEventListener("resume", onResume, false);
        /* always route to conversation and refresh when resume */
        function onResume() {
            if ($localstorage.getUserNickname()) {
                $window.location.hash = "#tab/conversation";
            } else {
                $window.location.hash = "#login";
            }
            $window.location.reload(true);
        }
        
        // Notification logic
        if ($window.device && $window.device.platform === 'iOS') {
                window.plugin.notification.local.registerPermission();
        }
        var count = 0;
        var notificationId = 1;
        
        var getCurrentActivityData = function() {
            return $translate.instant("89");

        };

        $window.plugin.notification.local.isScheduled(notificationId, function (isScheduled) {
            if(!isScheduled) {
                var today = new Date();
                var tomorrow = new Date();
                tomorrow.setDate(today.getDate()+1);
                tomorrow.setHours(10);
                var tomorrow_at_10_am = tomorrow;
                $window.plugin.notification.local.schedule({
                    id: notificationId,
                    text: getCurrentActivityData(), 
                    every: 'day',
                    firstAt: tomorrow_at_10_am
                }, function () {
                    console.log("Scheduled..");
                });
            }
        });

        $window.plugin.notification.local.on('click', function (notification) {
            console.log("Notification clicked");
            count = 0;
        });

     });
})

.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$localstorageProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider, $localstorageProvider) {


        $translateProvider.useStaticFilesLoader({
            prefix: 'language/',
            suffix: '.json'
        });

        /* set this to zh_ZH before release */
        $translateProvider.preferredLanguage('zh_ZH');

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
            });

        // if none of the above states are matched, use this as the fallback
        if ($localstorageProvider.$get().getUserNickname() != null) {
            $urlRouterProvider.otherwise('/tab/conversation');
        } else {
            $urlRouterProvider.otherwise('/login');
        }


    }
]);