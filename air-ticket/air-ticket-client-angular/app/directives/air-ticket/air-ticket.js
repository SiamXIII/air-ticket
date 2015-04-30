angular.module('airTicketApp')
	.directive('airTicket', function () {
		return {
			restrict: "E",
			templateUrl: 'app/directives/air-ticket/air-ticket.html',
			controller: 'ticketsCtrl'
		}
	});
