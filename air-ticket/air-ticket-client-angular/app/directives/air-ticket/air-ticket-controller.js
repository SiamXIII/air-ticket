angular.module('airTicketApp')
	.controller('ticketsCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			$scope.cityCodes = {};
			$scope.trips = {};

			ticketService.getCityCodes()
				.then(function(data) {
					$scope.cityCodes = data;
				});
		};
	});