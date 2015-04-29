angular.module('airTicketApp')
	.directive('airTicket', function () {
		return {
			restrict: "E",
			templateUrl: 'directives/air-ticket/air-ticket.html',
			controller: 'ticketsCtrl'
		}
	});
