angular.module('airTicketApp')
	.directive('airTicket', function (templatesPath) {
		return {
			restrict: "A",
			templateUrl: templatesPath + 'air-ticket.html',
			controller: 'ticketsCtrl'
		}
	});
