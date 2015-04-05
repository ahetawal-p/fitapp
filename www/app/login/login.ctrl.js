	angular.module('app.login').controller('LoginCtrl', ['$state', '$scope', LoginCtrl]);
	function LoginCtrl($state, $scope){
		var vm = this;

		// vm.myProfile = stubService.getProfile();
		vm.login = function(){
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
            $state.go('tab.conversation');


		}
	};