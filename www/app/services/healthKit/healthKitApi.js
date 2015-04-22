angular.module('app.services.healthKit')

.factory('healthKitApi', ['$cordovaHealthKit', '$q', '$window',
    function($cordovaHealthKit, $q, $window) {
        var healthKitExists = false;
        var NUM_OF_DAYS_DATA = 20;

        function getWalkingAndRunningDistance() {
            var deferred = $q.defer(),
                startDate = new Date(new Date().getTime() - NUM_OF_DAYS_DATA * 24 * 60 * 60 * 1000),
                endDate = new Date();

            var queryObject = {
                'startDate': startDate,
                'endDate': endDate,
                'sampleType': "HKQuantityTypeIdentifierDistanceWalkingRunning",
                'unit': 'km'
            };

            if (!$cordovaHealthKit){
                deferred.reject();
            }

            $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
                deferred.resolve(response);
            }, function(err) {
                alert(err);
                console.log(err);
                deferred.reject();
            });

            return deferred.promise;
        }

        function getWalkingAndRunningDistanceByDateTime(startDate, endDate) {
            var deferred = $q.defer();
            var queryObject = {
                'startDate': new Date(startDate),
                'endDate': new Date(endDate),
                'sampleType': "HKQuantityTypeIdentifierDistanceWalkingRunning",
                'unit': 'km'
            };

            $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
                //         console.log("#######getWalkingAndRunningDistanceByDateTime#######");
                // console.log(JSON.stringify(response));
                deferred.resolve(response);
            }, function(err) {
                alert(err);
                console.log(err);
                deferred.reject();
            });

            return deferred.promise;
        }

        function checkHealthKitExists() {
            var deferred = $q.defer();
            try {
                $cordovaHealthKit.isAvailable().then(
                    function(yes) {
                        // HK is available
                        healthKitExists = true;
                        deferred.resolve(true);
                    }, function(no) {
                        // No HK available
                        alert('no healthkit');
                    });
            } catch (exception) {
                deferred.resolve(false);
            }

            return deferred.promise;
        }

        /* request HealthKit authorization and check 
        * if permissions are enabled 
        */
        function requestAuthorization() {
            var deferred = $q.defer();

            var distanceWalkRunPermissions = 'HKQuantityTypeIdentifierDistanceWalkingRunning';
            var permissions = [
                distanceWalkRunPermissions
                //,'HKCategoryValueSleepAnalysisAsleep'
            ];

            /* first request authorization from user */
            $cordovaHealthKit.requestAuthorization(
                permissions // Read permission
                ,permissions // Write permission
            ).then(function(success) {
                /* then check if auth permissions are enabled. 
                 * checkAuthStatus not added to ngCordova yet
                 * so using $window.plugins for now 
                */
                $window.plugins.healthkit.checkAuthStatus({
                        'type': distanceWalkRunPermissions
                    }, function(response){
                        console.log('checkAuth', JSON.stringify(response));
                        deferred.resolve(response);
                    }, function(err){
                        console.log('checkAuthStatus error');
                        deferred.reject(err);
                    });

            }, function(err) {
                console.log("error! " + err);
                deferred.reject(err);
            });

            return deferred.promise;
        }

        function getWorkouts() {
            return $cordovaHealthKit.findWorkouts();
        }

        function getWorkoutDistanceAndCalories(rawWorkoutObject) {
            // taking out deferred antipattern
            return getWorkoutDistance(rawWorkoutObject, distanceCaloriesObject).then(getWorkoutCalories(rawWorkoutObject, distanceCaloriesObject));
        }

        function getWorkoutDistance(rawWorkoutObject, distanceCaloriesObject) {
            var deferred = $q.defer();
            var sampleType;
            if (rawWorkoutObject.activityType == "HKWorkoutActivityTypeCycling") {
                sampleType = "HKQuantityTypeIdentifierDistanceCycling";
            } else {
                sampleType = "HKQuantityTypeIdentifierDistanceWalkingRunning";
            }

            console.log("Type: " + rawWorkoutObject.activityType);

            var queryObject = {
                'startDate': new Date(rawWorkoutObject.startDate.replace(/-/g, "/")),
                'endDate': new Date(rawWorkoutObject.endDate.replace(/-/g, "/")),
                'sampleType': sampleType,
                'unit': 'km'
            };

            $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
                distanceCaloriesObject.distance = response.quantity;
                deferred.resolve(response);
            }, function(err) {
                alert(err);
                console.log(err);
                deferred.reject();
            });

            return deferred.promise;
        }

        function getWorkoutCalories(rawWorkoutObject, distanceCaloriesObject) {
            var deferred = $q.defer();
            console.log("in workoutCalories: " + JSON.stringify(rawWorkoutObject));
            var queryObject = {
                'startDate': new Date(rawWorkoutObject.startDate.replace(/-/g, "/")),
                'endDate': new Date(rawWorkoutObject.endDate.replace(/-/g, "/")),
                'sampleType': "HKQuantityTypeIdentifierActiveEnergyBurned",
                'unit': 'kcal'
            };

            $cordovaHealthKit.querySampleType(queryObject).then(function(response) {
                distanceCaloriesObject.calories = response[0].quantity;
                deferred.resolve(response);
            }, function(err) {
                alert(err);
                console.log(err);
                deferred.reject();
            });

            return deferred.promise;
        }

        return {
            getWorkouts: getWorkouts,
            getWorkoutDistance: getWorkoutDistance,
            getWorkoutCalories: getWorkoutCalories,
            checkHealthKitExists: checkHealthKitExists,
            requestAuthorization: requestAuthorization,
            getWorkoutDistanceAndCalories: getWorkoutDistanceAndCalories,
            getWalkingAndRunningDistance: getWalkingAndRunningDistance,
            getWalkingAndRunningDistanceByDateTime: getWalkingAndRunningDistanceByDateTime
        }
    }
]);