angular.module('app.activity.update')

.controller('UpdateActivityCtrl', [
		'$scope',
		'$state',
		'fitApi',
		function ($scope, $state, fitApi) {

			 $scope.showAlert = function(){ alert("I'm a modal window!") }

		}


]);