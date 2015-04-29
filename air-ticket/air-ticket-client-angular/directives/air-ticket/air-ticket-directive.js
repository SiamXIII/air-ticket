angular.module('airTicketApp')
	.directive('airTicket', function () { 
		return {
			templateUrl:'directives/air-ticket//air-ticket.html',
			controller:'ticketsCtrl'
		}
	});
