/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function(ticketService, $scope) {
		$scope.init = function () {
			$scope.search = {
				fromLocationCode: '',
				toLocationCode: '',
				twoWay: ''
			};
		}

		$scope.searchTrips = function() {
			ticketService.searchTrips($scope.search)
				.then(function(data) {
					$scope.trips = data.map(function (trip) {

						var mapLocation = function(location) {
							var result = {
								code: location.getCode()
							};

							return result;
						}

						var mapFlight = function(flight) {
							var result = {
								from: mapLocation(flight.getFromLocation()),
								to: mapLocation(flight.getToLocation()),
								departureTime: flight.getDepartureTime(),
								arrivalTime: flight.getArrivalTime(),
								duration: flight.getDuration()
							};

							return result;
						}

						var mapRoute = function (route) {
							var flightViewModels = [];

							for (var i = 0; i < route.getFlightsCount(); i++) {
								flightViewModels.push(mapFlight(route.getFlight(i)));
							}

							var result = {
								from: mapLocation(route.getFromLocation()),
								to: mapLocation(route.getToLocation()),
								departureTime: route.getDepartureTime(),
								arrivalTime: route.getArrivalTime(),
								duration: route.getDuration(),
								flights: flightViewModels
							};

							return result;
						}

						return {
							from: mapLocation(trip.getFromLocation()),
							to: mapLocation(trip.getToLocation()),
							forwardRoute: mapRoute(trip.getForwardRoute())
						};
					});
				});
		}
	});