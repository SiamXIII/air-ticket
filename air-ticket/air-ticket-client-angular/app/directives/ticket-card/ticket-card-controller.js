angular.module('airTicketApp')
.controller('ticketCardCtrl', function ($scope) {
	$scope.detailed = false;

	$scope.getFlightTime = function (departure,arrival) {
		return {
			hours: moment.utc(moment(arrival).diff(moment(departure))).format("H"),
			minutes: moment.utc(moment(arrival).diff(moment(departure))).format("m")
		};
	}

	$scope.toggleDetails = function(){
		$scope.detailed = $scope.detailed ? false : true;
	}
});