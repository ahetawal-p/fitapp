	angular.module('app.login').controller('LoginCtrl', ['$state', '$scope', LoginCtrl]);
	function LoginCtrl($state, $scope){
		var vm = this;
		vm.user = {
			email: ''
		};

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
			console.log(form);
			if (form.$valid){
				console.log("Log in", vm.email);
	            $state.go('tab.conversation');
			}
		}
	};