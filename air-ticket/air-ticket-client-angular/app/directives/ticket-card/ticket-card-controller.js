angular.module('airTicketApp')
.controller('ticketCardCtrl', function ($scope) {
	$scope.detailed = false;

	$scope.toggleDetails = function (route) {
		$scope.detailed = $scope.detailed ? false : true;
	}
});