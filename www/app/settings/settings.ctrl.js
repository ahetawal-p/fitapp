	angular.module('app.settings').controller('SettingsCtrl', ['$state', 'fitApi','$ionicModal', '$scope', SettingsCtrl]);
	function SettingsCtrl($state, fitApi, $ionicModal, $scope){
		var vm = this;
		vm.myProfile = fitApi.getProfile();
		vm.goalTypes = fitApi.getGoalTypes();
		vm.selectedGoal = vm.goalTypes[vm.myProfile.goalTypeId];

		$ionicModal.fromTemplateUrl('app/settings/editProfileModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editProfileModal = modal;
		  });
		  $scope.openEditProfileModal = function() {
		    $scope.editProfileModal.show();
		  };
		  $scope.closeEditProfileModal = function() {
		    $scope.editProfileModal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.editProfileModal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('editProfileModal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('editProfileModal.removed', function() {
		    // Execute action
		  });
	};