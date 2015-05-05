angular.module('airTicketApp')
.directive('ticketList', function (templatesPath) {
	return {
		restrict: 'E',
		templateUrl: templatesPath + 'ticket-list.html',
		controller: 'ticketListCtrl',
		scope: {
			flights: '=',
			direction: '@'
		}
	}
});