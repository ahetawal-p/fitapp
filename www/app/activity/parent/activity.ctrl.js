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
        // document.body.classList.remove('platform-ios');
        // document.body.classList.remove('platform-android');
        // document.body.classList.add('platform-' + p);
        $scope.demo = p;
    }
}

]);