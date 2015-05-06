angular.module('airTicketApp')
	.directive('airTicket', function (templatesPath) {
		return {
			restrict: "E",
			replace: true,
			templateUrl: templatesPath + 'air-ticket.html',
			controller: 'ticketsCtrl'
		}
	});
