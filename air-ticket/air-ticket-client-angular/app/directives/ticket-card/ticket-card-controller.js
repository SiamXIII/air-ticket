angular.module('airTicketApp')
.controller('ticketCardCtrl', function ($scope) {
	$scope.ticket = $scope.tickets[0];
});