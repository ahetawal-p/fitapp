angular.module('app.activity.update')

.controller('UpdateActivityCtrl', [
		'$scope',
		'$state',
		function ($scope, $state) {

			 $scope.showAlert = function(){ alert("I'm a modal window!") }

		}


]);