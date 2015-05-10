angular.module('airTicketApp')
.directive('ticketList', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'ticket-list.html',
		controller: 'ticketListCtrl'
	}
});