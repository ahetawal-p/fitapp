angular.module('app.activity.create')

.controller('CreateActivityCtrl', [
		'$scope',
		'$state',
		function ($scope, $state) {

			 $scope.showAlert = function(){ alert("I'm a modal window!") }

		}


]);