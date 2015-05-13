angular.module('airTicketApp')
	.controller('ticketsCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			$scope.locationCodes = {};
			$scope.trips = {};

			ticketService.getLocations()
				.then(function(data) {
					$scope.locationCodes = data.map(function (location) {
					return location.getCode();
				});
			});
		};
	});