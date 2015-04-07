(function() {
    angular.module('app.activity.parent')
        .controller('ActivityListCtrl', [
            '$scope',
            '$state',
            '$ionicModal',
            'healthKitService',
            'chartConfigFactory',
            '$ionicLoading',
            function($scope, $state, $ionicModal, healthKitService, chartConfigFactory, $ionicLoading) {

                var vm = this;
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200,
                    showDelay: 0
                });

                /* load activities */
                loadActivities("regular");

                /* testing here */
                healthKitService.getCombinedTimesOfDayAverages().then(function(response){
                    console.log("RESOPNSE");
                    console.log(response);
                });

                vm.reloadActivities = function(){
                    loadActivities("reload");
                }

                function loadActivities(loadType) {
                    healthKitService.getActivities().then(function(response) {
                        $ionicLoading.hide();
                        vm.activities = response;
                        /* handle reload case */
                        if (loadType === "reload"){
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    });
                }

                vm.openEditActivityModal = function(activity) {
                    vm.selectedActivity = activity;
                    $scope.openEditActivityModal();
                };

                vm.createActivity = function() {
                    $scope.openSelectActivityTypeModal();
                };

                vm.selectActivityType = function(activityType) {
                    $scope.selectedActivity = buildNewActivity(activityType);
                    $scope.openCreateActivityModal();
                };

                // $scope.demo = 'ios';
                $scope.setPlatform = function(p) {
                    document.body.classList.remove('platform-ios');
                    document.body.classList.remove('platform-android');
                    document.body.classList.add('platform-' + p);
                    $scope.demo = p;
                }

                $scope.setPlatform('ios');


                buildNewActivity = function(activityType) {
                    var activity = {
                        activityType: activityType,
                        icon: activityType.icon
                    };
                    // activity.activityType = activityType;
                    // activity.icon = activityType.icon;
                    var currentTime = new Date();

                    if (activityType.activityType === "sleep") {
                        activity.date = currentTime.getDate();
                        activity.length = "8 hours";
                        activity.timeStamp = "23:00";
                    } else {
                        activity.date = currentTime.getDate();
                        activity.length = "5 mins";
                        activity.timeStamp = currentTime.getTime();
                    }

                    return activity;
                };

                // $ionicModal.fromTemplateUrl('app/activity/update/updateActivityModal.html', {
                //     scope: $scope,
                //     animation: 'slide-in-up'
                // }).then(function (modal) {
                //     $scope.editActivityModal = modal;
                // });
                // $scope.openEditActivityModal = function () {
                //     $scope.editActivityModal.show();
                // };
                // $scope.closeEditActivityModal = function () {
                //     $scope.editActivityModal.hide();
                // };
                // //Cleanup the modal when we're done with it!
                // $scope.$on('$destroy', function () {
                //     $scope.editActivityModal.remove();
                // });
                // // Execute action on hide modal
                // $scope.$on('editActivityModal.hidden', function () {
                //     // Execute action
                // });
                // // Execute action on remove modal
                // $scope.$on('editActivityModal.removed', function () {
                //     // Execute action
                // });


                // $ionicModal.fromTemplateUrl('app/activity/create/createActivityModal.html', {
                //     scope: $scope,
                //     animation: 'slide-in-up'
                // }).then(function (modal) {
                //     $scope.createActivityModal = modal;
                // });
                // $scope.openCreateActivityModal = function () {
                //     $scope.createActivityModal.show();
                // };
                // $scope.closeCreateActivityModal = function () {
                //     $scope.createActivityModal.hide();
                // };
                // //Cleanup the modal when we're done with it!
                // $scope.$on('$destroy', function () {
                //     $scope.createActivityModal.remove();
                // });
                // // Execute action on hide modal
                // $scope.$on('createActivityModal.hidden', function () {
                //     // Execute action
                // });
                // // Execute action on remove modal
                // $scope.$on('createActivityModal.removed', function () {
                //     // Execute action
                // });

                // $ionicModal.fromTemplateUrl('app/activity/create/selectActivityTypeModal.html', {
                //     scope: $scope,
                //     animation: 'slide-in-up'
                // }).then(function (modal) {
                //     $scope.selectActivityTypeModal = modal;
                // });
                // $scope.openSelectActivityTypeModal = function () {
                //     $scope.selectActivityTypeModal.show();
                // };
                // $scope.closeSelectActivityTypeModal = function () {
                //     $scope.selectActivityTypeModal.hide();
                // };
                // //Cleanup the modal when we're done with it!
                // $scope.$on('$destroy', function () {
                //     $scope.selectActivityTypeModal.remove();
                // });
                // // Execute action on hide modal
                // $scope.$on('selectActivityTypeModal.hidden', function () {
                //     // Execute action
                // });
                // // Execute action on remove modal
                // $scope.$on('selectActivityTypeModal.removed', function () {
                //     // Execute action
                // });


                //
            }

        ])
})();