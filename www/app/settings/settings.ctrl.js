	angular.module('app.settings').controller('SettingsCtrl', ['$state', 'stubService','$ionicModal', '$scope', 'emailInfoFactory', SettingsCtrl]);
	function SettingsCtrl($state, stubService, $ionicModal, $scope, emailInfoFactory){
		var vm = this;
		vm.myProfile = stubService.getProfile();
		vm.goalTypes = stubService.getGoalTypes();
		vm.selectedGoalTypeId = vm.myProfile.goalTypeId;

		vm.reportProblem = function(){
    		  window.plugin.email.open(emailInfoFactory.createEmail('reportProblem') , 
    		  	function () {},
            this);    
		}

		vm.giveFeedback = function(){
    		  window.plugin.email.open(emailInfoFactory.createEmail('giveFeedback') , 
    		  	function () {},
            this);    
		}

		  vm.openEditProfileModal = function() {
		    $scope.editProfileModal.show();
		  };

		$ionicModal.fromTemplateUrl('app/settings/editProfileModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editProfileModal = modal;
		  });
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