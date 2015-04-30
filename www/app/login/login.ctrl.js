	angular.module('app.login').controller('LoginCtrl', ['$state', '$scope', '$localstorage', LoginCtrl]);
	function LoginCtrl($state, $scope, $localstorage){
		var vm = this;

		/* check if user exists. if so, redirect to conversation.
		   if not, then display login form */
		vm.user = $localstorage.getUser();
		vm.showLogin = false;

		if (vm.user){
	        $state.go('tab.conversation');
		} else{
			vm.showLogin = true;
			vm.email = "";
		}
		// vm.myProfile = stubService.getProfile();
		vm.logIn = function(form){
                // Wechat.isInstalled(function (installed) {
                //     alert("Wechat installed: " + (installed ? "Yes" : "No"));
                // });

			/*
			Wechat.auth("snsapi_userinfo", function (response) {
                    // you may use response.code to get the access token.
                    alert(JSON.stringify(response));

                }, function (reason) {
                    alert("Failed: " + reason);
			});

			*/
			if (form.$valid){
				$localstorage.setEmail(vm.email);
	            $state.go('tab.conversation');
			}
		}
	};