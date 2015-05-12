/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			$scope.search = {
				fromCityCode: '',
				toCityCode: '',
				fromLocationCode: '',
				toLocationCode: '',
				forwardRouteDepartureDate: '',
				backRouteDepartureDate: '',
				twoWay: ''
			};
		}

		$scope.searchTrips = function() {
			ticketService.searchTrips(new AirTicket_Domain_Entities.TripQuery(
					new AirTicket_Domain_Entities.RouteQuery(
						new AirTicket_Domain_Entities.LocationQuery(null, $scope.search.fromCityCode),
						new AirTicket_Domain_Entities.LocationQuery(null, $scope.search.toCityCode),
						new Date($scope.search.forwardRouteDepartureDate),
						new Date(new Date($scope.search.forwardRouteDepartureDate).valueOf() + 1000 * 60 * 60 * 24 - 1)),
					$scope.search.twoWay ?
					new AirTicket_Domain_Entities.RouteQuery(
						new AirTicket_Domain_Entities.LocationQuery(null, $scope.search.toCityCode),
						new AirTicket_Domain_Entities.LocationQuery(null, $scope.search.fromCityCode),
						new Date($scope.search.backRouteDepartureDate),
						new Date(new Date($scope.search.backRouteDepartureDate).valueOf() + 1000 * 60 * 60 * 24 - 1)) :
					null)
			).then(function(data) {
				$scope.trips = data.map(function(trip) {

					var mapLocation = function(location) {
						var result = {
							code: location.getCode(),
							fullName: location.getFullName(),
							cityCode: location.getCityCode()
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

					var mapRoute = function(route) {
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

					var tripViewModel = {
						from: mapLocation(trip.getFromLocation()),
						to: mapLocation(trip.getToLocation()),
						forwardRoute: mapRoute(trip.getForwardRoute()),
						backRoute: trip.getBackRoute() ? mapRoute(trip.getBackRoute()) : null
					};

					return tripViewModel;
				});
			});
		}
	});