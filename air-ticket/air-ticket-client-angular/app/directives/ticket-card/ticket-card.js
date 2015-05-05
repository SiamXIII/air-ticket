angular.module('airTicketApp')
.directive('ticketCard', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/directives/ticket-card/ticket-card.html',
		controller: 'ticketCardCtrl'
	}
});