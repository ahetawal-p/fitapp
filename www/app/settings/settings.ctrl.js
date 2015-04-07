	angular.module('app.settings').controller('SettingsCtrl', ['$state', 'stubService','$ionicModal', '$scope', 'emailInfoFactory', '$ionicPopup', '$localstorage', '$translate', SettingsCtrl]);
	function SettingsCtrl($state, stubService, $ionicModal, $scope, emailInfoFactory, $ionicPopup, $localstorage, $translate){
		var vm = this;
		vm.myProfile = stubService.getProfile();
		vm.nickname = $localstorage.getUserNickname();
		vm.goalTypes = stubService.getGoalTypes();
		vm.selectedGoalTypeId = vm.myProfile.goalTypeId;
		vm.selectedLanguageId = $localstorage.getUserLanguageId();

		vm.languages = 
		[	{
				id: "en_US",
				languageName: "English"
			},
			{
				id: "zh_ZH",
				languageName: "Chinese"
			}
		];

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

		vm.changeLanguage = function(language){
			console.log(language);
			$translate.use(language.id);
			$localstorage.setUserLanguageId(language.id);
		}

		vm.clearData = function(){
			var confirmPopup = $ionicPopup.confirm({
			     title: 'Clear data',
			     template: 'Are you sure you want to clear data?'
			   });
			   confirmPopup.then(function(res) {
			     if(res) {
			       console.log('Clearing storage');
			       $localstorage.removeUser();
			     } else {
			       console.log('Cancel no clear');
			     }
			   });
		}

		$ionicModal.fromTemplateUrl('app/settings/editProfileModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.editProfileModal = modal;
		    $scope.editProfileModal.done = function() {
		    	/* set input values */

		    	$localstorage.setUserNickname(vm.nickname);
		    	$scope.editProfileModal.hide();
		  	}

		  	$scope.editProfileModal.cancel = function() {
		    	$scope.editProfileModal.hide();
		  	}
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