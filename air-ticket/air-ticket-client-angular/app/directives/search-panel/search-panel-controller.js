angular.module('airTicketApp')
.controller('searchPanelCtrl', function ($scope) {
	$scope.init = function () {
		$scope.departureCities = {};
		$scope.arrivalCities = {};
		$scope.direction = 'oneway';
	}

	$scope.isTwoWay = function () {
		return $scope.direction == 'twoway';
	}

});