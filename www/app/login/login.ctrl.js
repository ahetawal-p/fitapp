	angular.module('app.login').controller('LoginCtrl', ['$state', '$scope', '$localstorage', LoginCtrl]);
	function LoginCtrl($state, $scope, $localstorage){
		var vm = this;

		vm.showLogin = true;
		vm.email = "";
		
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