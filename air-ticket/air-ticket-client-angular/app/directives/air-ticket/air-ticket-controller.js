angular.module('airTicketApp')
	.controller('ticketsCtrl', function (ticketService, $scope) {

		$scope.trips = [];
		$scope.filteredTrips = [];

	});