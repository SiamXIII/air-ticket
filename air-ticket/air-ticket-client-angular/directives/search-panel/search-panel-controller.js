angular.module('airTicketApp')
.controller('searchPanelCtrl', function ($scope) {
	$scope.departureCities = {};
	$scope.arrivalCities = {};

	$scope.$watch('tickets', function (tickets) {
		if (tickets) {
			angular.forEach(tickets, function (value) {
				if (!$scope.departureCities[value.from]) {
					$scope.departureCities[value.from] = {};
					$scope.departureCities[value.from].name = value.from;
					$scope.departureCities[value.from].active = true;
				}

				if (!$scope.arrivalCities[value.to]) {
					$scope.arrivalCities[value.to] = {};
					$scope.arrivalCities[value.to].name = value.to;
					$scope.arrivalCities[value.to].active = true;
				}
			});
		}
	})
});