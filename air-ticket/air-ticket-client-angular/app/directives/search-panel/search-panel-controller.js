angular.module('airTicketApp')
.controller('searchPanelCtrl', function (ticketService, $scope) {
	$scope.init = function () {
		$scope.departureCities = {};
		$scope.arrivalCities = {};
		$scope.direction = 'oneway';

		$scope.search = {
			from: '',
			to: ''
		};
	}

	$scope.isTwoWay = function () {
		return $scope.direction == 'twoway';
	}

	$scope.searchTrips = function () {
		ticketService.searchTrips({
			search: $scope.search,
			params: {
				twoway: $scope.direction == 'twoway'
			}
		})
		.success(function (data) {
			$scope.resultsDirection = $scope.direction;
			$scope.flights = data;
		});
	}
});