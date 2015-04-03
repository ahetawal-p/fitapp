angular.module('app.activity.parent')

    .controller('ActivityParentCtrl', [
    '$scope',
    '$state',
    '$ionicModal',
    'healthKitService',
    'chartConfigFactory',

function ($scope, $state, $ionicModal, healthKitService, chartConfigFactory) {

    var vm = this;
    $scope.demo = 'ios';
    $scope.setPlatform = function (p) {
        $scope.demo = p;
    }


    // buildNewActivity = function (activityType) {
    //     var activity = {
    //         activityType: activityType,
    //         icon: activityType.icon
    //     };
    //     // activity.activityType = activityType;
    //     // activity.icon = activityType.icon;
    //     var currentTime = new Date();

    //     if (activityType.activityType === "sleep") {
    //         activity.date = currentTime.getDate();
    //         activity.length = "8 hours";
    //         activity.timeStamp = "23:00";
    //     } else {
    //         activity.date = currentTime.getDate();
    //         activity.length = "5 mins";
    //         activity.timeStamp = currentTime.getTime();
    //     }

    //     return activity;
    // };

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


}

]);