angular.module('airTicketApp')
.controller('tripCtrl', function ($scope) {
	$scope.detailed = false;

	$scope.toggleDetails = function (route) {
		$scope.detailed = $scope.detailed ? false : true;
	}
});