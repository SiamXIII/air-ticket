angular.module('airTicketApp')
.controller('ticketCardCtrl', function ($scope) {
	$scope.getFlightTime = function () {
		return {
			hours: moment.utc(moment($scope.flight.arrivalDate).diff(moment($scope.flight.departureDate))).format("H"),
			minutes: moment.utc(moment($scope.flight.arrivalDate).diff(moment($scope.flight.departureDate))).format("m")
		};
	}
});