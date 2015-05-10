angular.module('airTicketApp')
	.controller('searchPanelCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			$scope.search = {
				fromLocationCode: '',
				toLocationCode: ''
			};
		}

		$scope.searchTrips = function() {
			ticketService.searchTrips($scope.search)
				.then(function(data) {
					$scope.trips = data.map(function (trip) {

						var mapLocation = function(location) {
							return {
								code: location.getCode()
							};
						}

						var mapFlight = function(flight) {
							return {
								from: mapLocation(flight.getFromLocation()),
								to: mapLocation(flight.getToLocation())
							}
						}

						var mapRoute = function (route) {
							var flightViewModels = [];

							for (var i = 0; i < route.getFlightsCount(); i++) {
								flightViewModels.push(mapFlight(route.getFlight(i)));
							}

							return {
								flights: flightViewModels
							};
						}

						return {
							from: mapLocation(trip.getFromLocation()),
							to: mapLocation(trip.getToLocation()),
							forwartRoute: mapRoute(trip.getForwardRoute())
						};
					});
				});
		}
	});