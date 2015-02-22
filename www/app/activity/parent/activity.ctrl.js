angular.module('app.activity.parent')

.controller('ActivityParentCtrl', ['$state','$ionicModal','$scope','fitApi',
		function ($state, $ionicModal, $scope, fitApi) {

		var vm = this;
		vm.activities = fitApi.getActivities();
		vm.activityTypes = fitApi.getActivityTypes();

		vm.openEditActivityModal = function(activity){
			vm.selectedActivity = activity;
			$scope.openEditActivityModal();
		};


		$ionicModal.fromTemplateUrl('app/activity/update/editActivityModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editActivityModal = modal;
		  });
		  $scope.openEditActivityModal = function() {
		    $scope.editActivityModal.show();
		  };
		  $scope.closeEditActivityModal = function() {
		    $scope.editActivityModal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.editActivityModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('editActivityModal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('editActivityModal.removed', function() {
		    // Execute action
		  });
	

		 $ionicModal.fromTemplateUrl('app/activity/create/createActivityModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.createActivityModal = modal;
		  });
		  $scope.openCreateActivityModal = function() {
		    $scope.createActivityModal.show();
		  };
		  $scope.closeCreateActivityModal = function() {
		    $scope.createActivityModal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.createActivityModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('createActivityModal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('createActivityModal.removed', function() {
		    // Execute action
		  });
		}	

]);