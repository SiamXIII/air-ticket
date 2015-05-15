/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function (ticketService, $scope) {
		$scope.init = function () {
			$scope.search = {
				fromLocationCode: 'MCA',
				toLocationCode: 'JFK',
				forwardRouteDepartureDate: '05/11/2015',
				backRouteDepartureDate: '',
				twoWay: ''
			};
		}

		$scope.searchTrips = function () {
			var currentZone = moment().zone();
			var departureDay = moment($scope.search.forwardRouteDepartureDate).subtract(currentZone, 'm').subtract($scope.getLocation($scope.search.fromLocationCode).getTimeZoneOffset(), 'h');
			var returnDate = $scope.search.backRouteDepartureDate
				? moment($scope.search.backRouteDepartureDate).subtract(currentZone, 'm').subtract($scope.getLocation($scope.search.toLocationCode).getTimeZoneOffset(), 'h')
				: undefined;

			ticketService.searchTrips(new AirTicket_Domain_Queries.TripQuery(
				new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					moment(departureDay).utc(),
					moment(departureDay).utc().add(1, 'd')),
				$scope.search.twoWay
				? new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					moment(returnDate).utc(),
					moment(returnDate).utc().add(1, 'd'))
				: null), function (data) {
					$scope.trips = data.map(function (trip) {

						var mapLocation = function (location) {
							var result = {
								code: location.getCode(),
								fullName: location.getFullName(),
								timeZoneOffset: location.getTimeZoneOffset()
							};

							return result;
						}

						var mapFlight = function (flight) {
							var result = {
								from: mapLocation(flight.getFromLocation()),
								to: mapLocation(flight.getToLocation()),
								departureTime: flight.getDepartureTime(),
								arrivalTime: flight.getArrivalTime(),
								duration: flight.getDuration(),
								code: flight.getCode(),
								vendorCode: flight.getVendorCode(),
								price: flight.getPrice()
							};

							return result;
						}

						var mapRoute = function (route) {
							var flightViewModels = [];

							for (var i = 0; i < route.getFlightsCount() ; i++) {
								flightViewModels.push(mapFlight(route.getFlight(i)));
							}

							var result = {
								from: mapLocation(route.getFromLocation()),
								to: mapLocation(route.getToLocation()),
								departureTime: route.getDepartureTime(),
								arrivalTime: route.getArrivalTime(),
								duration: route.getDuration(),
								flights: flightViewModels,
								price: route.getPrice()
							};

							return result;
						}

						var tripViewModel = {
							from: mapLocation(trip.getFromLocation()),
							to: mapLocation(trip.getToLocation()),
							forwardRoute: mapRoute(trip.getForwardRoute()),
							backRoute: trip.getBackRoute() ? mapRoute(trip.getBackRoute()) : null,
							price: trip.getPrice()
						};

						return tripViewModel;
					});
				});
		}
	});