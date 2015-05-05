angular.module('airTicketApp')
.directive('ticketList', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/directives/ticket-list/ticket-list.html',
		controller: 'ticketListCtrl',
		scope: {
			flights: '=',
			direction: '@'
		}
	}
});