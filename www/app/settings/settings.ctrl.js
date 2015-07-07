	angular.module('app.settings').controller('SettingsCtrl', ['$state','$ionicModal', '$scope', 'emailInfoFactory', '$ionicPopup', '$localstorage', '$translate', '$window', SettingsCtrl]);
	function SettingsCtrl($state, $ionicModal, $scope, emailInfoFactory, $ionicPopup, $localstorage, $translate, $window){
		var vm = this;
		vm.nickname = $localstorage.getUserNickname();
		vm.email = $localstorage.getEmail();
		vm.selectedLanguageId = $localstorage.getUserLanguageId();

		vm.languages = 
		[	{
				id: "en_US",
				languageName: "English"
			},
			{
				id: "zh_ZH",
				languageName: "中文"
			}
		];

		function clearFrontEndData(){
			$translate.use("en_US");
			vm.nickname = "";
		}

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
		  	vm.nickname = $localstorage.getUserNickname();
		    $scope.editProfileModal.show();
		 };

		

		vm.changeLanguage = function(language){
			console.log(language);
			$translate.use(language.id);
			$localstorage.setUserLanguageId(language.id);
		}

		vm.setNickname = function() {
			if(vm.nickname == "") return;
			$localstorage.setUserNickname(vm.nickname);			
		};

		vm.clearData = function(){
			var clearDataString = $translate.instant("Clear_Data");
			var clearDataQuesString = $translate.instant("Clear_Data_Ques");
			

			var confirmPopup = $ionicPopup.confirm({
			     title: clearDataString,
			     template: clearDataQuesString
			   });
			   confirmPopup.then(function(res) {
			     if(res) {
			       console.log('Clearing storage');
			       clearFrontEndData();
			       // User object manupulation
			       $localstorage.removeUser();
			       // create new user object
			       /* set this to zh_ZH before release */
			       var language = $window.navigator.userLanguage || $window.navigator.language;
			       if(language && language.indexOf("zh") > -1){
            			$translate.preferredLanguage('zh_ZH');
            			$translate.use('zh_ZH');
        			}else {
             			$translate.preferredLanguage('en_US');
             			$translate.use('en_US');
        			}

			       //$translate.preferredLanguage('en_US');
			       var skeletonUser = $localstorage.createUserSkeleton($translate.preferredLanguage());
			       $localstorage.setObject("user", skeletonUser);
			       vm.selectedLanguageId = $localstorage.getUserLanguageId();
			       
			       $scope.editProfileModal.hide();
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

		  vm.openTermsOfServiceModal = function() {
		  	$scope.termsOfServiceModal.show();
		 };

		  $ionicModal.fromTemplateUrl('app/settings/termsOfServiceModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.termsOfServiceModal = modal;
		    $scope.termsOfServiceModal.done = function() {
		    	$scope.termsOfServiceModal.hide();
		  	}

		  	$scope.termsOfServiceModal.cancel = function() {
		    	$scope.termsOfServiceModal.hide();
		  	}
		  });

		 
		 vm.openPrivacyModal = function() {
		  	$scope.privacyModal.show();
		 };

		  $ionicModal.fromTemplateUrl('app/settings/privacyModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.privacyModal = modal;
		    $scope.privacyModal.done = function() {
		    	$scope.privacyModal.hide();
		  	}

		  	$scope.privacyModal.cancel = function() {
		    	$scope.privacyModal.hide();
		  	}
		  });


		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.editProfileModal.remove();
		    $scope.termsOfServiceModal.remove();
		    $scope.privacyModal.remove();

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