angular.module('airTicketApp')
.directive('ticketCard', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'ticket-card.html',
		controller: 'ticketCardCtrl',
		scope: {
			flight: '=',
		}
	}
});