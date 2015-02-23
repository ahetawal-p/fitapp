angular.module('app.activity.create')

.controller('CreateActivityCtrl', [
		'$scope',
		'$state',
		'fitApi',
		function ($scope, $state, fitApi) {

			 $scope.showAlert = function(){ alert("I'm a modal window!") }

		}


]);