﻿angular.module('airTicketApp')
.controller('ticketsCtrl', function (ticketService, $scope) {
	$scope.select2options = {

	};

	ticketService.getPlaces()
	.success(function (data) {
		$scope.places = data;
	});
});