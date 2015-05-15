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

			$scope.people = {
				adults: 1,
				children: 0,
				infants: 0
			};
		}

		$scope.searchTrips = function () {
			ticketService.searchTrips(new AirTicket_Domain_Queries.TripQuery(
				new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.forwardRouteDepartureDate),
						$scope.getLocation($scope.search.fromLocationCode).getTimeZoneOffset()),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						AirTicket_Utils.DateTimeUtils.addOneDayWithoutOneMilisecond(
							new Date($scope.search.forwardRouteDepartureDate)),
						$scope.getLocation($scope.search.fromLocationCode).getTimeZoneOffset())),
				$scope.search.twoWay
				? new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.backRouteDepartureDate),
						$scope.getLocation($scope.search.toLocationCode).getTimeZoneOffset()),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						AirTicket_Utils.DateTimeUtils.addOneDayWithoutOneMilisecond(
							new Date($scope.search.backRouteDepartureDate)),
						$scope.getLocation($scope.search.toLocationCode).getTimeZoneOffset()))
				: null,
				$scope.people), function (data) {
					$scope.trips = data.map(function (trip) {

						var mapLocation = function (location) {
							var result = {
								code: location.getCode(),
								fullName: location.getFullName(),
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
								price: flight.getAdultPrice()
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
								price: route.getAdultPrice()
							};

							return result;
						}

						var tripViewModel = {
							from: mapLocation(trip.getFromLocation()),
							to: mapLocation(trip.getToLocation()),
							forwardRoute: mapRoute(trip.getForwardRoute()),
							backRoute: trip.getBackRoute() ? mapRoute(trip.getBackRoute()) : null,
							price: trip.getPrice(),
							people: trip.getPeople()
						};

						return tripViewModel;
					});
				});
		}
	});