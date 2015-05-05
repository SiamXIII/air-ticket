angular.module('airTicketApp')
	.directive('airTicket', function (templatesPath) {
		return {
			restrict: "E",
			templateUrl: templatesPath + 'air-ticket.html',
			controller: 'ticketsCtrl'
		}
	});
