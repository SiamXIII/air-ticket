/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function(ticketService, $scope) {
		var allLocations = [];

		function getAllLocations() {
			return allLocations;
		}

		function getLocation(locationCode) {
			var allLocations = getAllLocations();
			for (var i = 0; i < allLocations.length; i++) {
				var location = allLocations[i];
				if (location.getCode() === locationCode) {
					return location;
				}
			}

			throw new Error("Location is not found.");
		}


		function buildTripQuery() {
			var tripQuery = new AirTicket_Domain_Queries.TripQuery(
				new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.forwardRouteDepartureDate),
						getLocation($scope.search.fromLocationCode).getTimeZoneOffset()),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.forwardRouteDepartureDate),
							getLocation($scope.search.fromLocationCode).getTimeZoneOffset()),
						1)),
				$scope.search.twoWay
				? new AirTicket_Domain_Queries.RouteQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocationCode),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocationCode),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.backRouteDepartureDate),
						getLocation($scope.search.toLocationCode).getTimeZoneOffset()),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.backRouteDepartureDate),
							getLocation($scope.search.toLocationCode).getTimeZoneOffset()),
						1))
				: null,
				$scope.people,
				1528199921900);

			return tripQuery;
		}

		function mapLocationToViewModel(location) {
			var result = {
				code: location.getCode(),
				fullName: location.getFullName(),
				timeZoneOffset: location.getTimeZoneOffset()
			};

			return result;
		}

		function mapFlightToViewModel(flight) {
			var result = {
				from: mapLocationToViewModel(flight.getFromLocation()),
				to: mapLocationToViewModel(flight.getToLocation()),
				departureTime: flight.getDepartureTime(),
				arrivalTime: flight.getArrivalTime(),
				duration: flight.getDuration(),
				code: flight.getCode(),
				vendorCode: flight.getVendorCode(),
				price: flight.getAdultPrice()
			};

			return result;
		}

		function mapRouteToViewModel(route) {
			var flightViewModels = [];

			for (var i = 0; i < route.getFlightsCount(); i++) {
				flightViewModels.push(mapFlightToViewModel(route.getFlight(i)));
			}

			var result = {
				from: mapLocationToViewModel(route.getFromLocation()),
				to: mapLocationToViewModel(route.getToLocation()),
				departureTime: route.getDepartureTime(),
				arrivalTime: route.getArrivalTime(),
				duration: route.getDuration(),
				flights: flightViewModels,
				price: route.getAdultPrice(),
				departureTimeHoursLocal: AirTicket_Utils.DateTimeUtils.getHours(route.getDepartureTime(), route.getFromLocation().getTimeZoneOffset()),
			};

			return result;
		}

		function mapTripToViewModel(trip) {
			var result = {
				from: mapLocationToViewModel(trip.getFromLocation()),
				to: mapLocationToViewModel(trip.getToLocation()),
				forwardRoute: mapRouteToViewModel(trip.getForwardRoute()),
				backRoute: trip.getBackRoute() ? mapRouteToViewModel(trip.getBackRoute()) : null,
				price: trip.getPrice(),
				people: trip.getPeople()
			};

			return result;
		}

		$scope.locationCodes = {};

		$scope.search = {
			fromLocationCode: 'MCA',
			toLocationCode: 'JFK',
			forwardRouteDepartureDate: '05/11/2015',
			backRouteDepartureDate: '05/12/2015',
			twoWay: 'true'
		};

		$scope.people = {
			adults: 1,
			children: 0,
			infants: 0
		}

		$scope.searchTrips = function() {
			ticketService.searchTrips(buildTripQuery(), function(data) {
				$scope.trips = data.map(mapTripToViewModel);
			});
		}

		ticketService.getLocations(
			function(data) {
				allLocations = data;
				$scope.locationCodes = allLocations.map(function(location) {
					var locationCode = location.getCode();
					return locationCode;
				});
			});
	});