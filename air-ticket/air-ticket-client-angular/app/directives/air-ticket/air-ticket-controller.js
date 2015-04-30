angular.module('airTicketApp')
.controller('ticketsCtrl', function (ticketService, $scope) {
	$scope.select2options = {

	};

	ticketService.getAllTickets()
	.success(function (data) {
		$scope.tickets = data;
	});
});