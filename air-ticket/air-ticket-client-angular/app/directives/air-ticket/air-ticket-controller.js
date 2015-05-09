angular.module('airTicketApp')
	.controller('ticketsCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			ticketService.getLocations()
				.then(function(data) {
					$scope.locations = data;
				});
		};
	});