angular.module('airTicketApp')
.controller('ticketCardCtrl', function ($scope) {
	$scope.getFlightTime = function (departure,arrival) {
		return {
			hours: moment.utc(moment(arrival).diff(moment(departure))).format("H"),
			minutes: moment.utc(moment(arrival).diff(moment(departure))).format("m")
		};
	}
});