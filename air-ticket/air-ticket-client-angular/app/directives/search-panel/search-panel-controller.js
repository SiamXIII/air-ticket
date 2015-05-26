/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function (ticketService, mapTripToViewModel, $scope, $filter) {
		var allLocations = [];

		function getAllLocations() {
			return allLocations;
		}

		function buildTripQuery() {
			var tripQuery = new AirTicket_Domain_Queries.TripQuery(
				new AirTicket_Domain_Queries.FlightChainQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocation.id),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocation.id),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.forwardRouteDepartureDate),
						$scope.search.fromLocation.timeZoneOffset),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.forwardRouteDepartureDate),
							$scope.search.fromLocation.timeZoneOffset),
						1)),
				$scope.search.twoWay
				? new AirTicket_Domain_Queries.FlightChainQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocation.id),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocation.id),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.backRouteDepartureDate),
						$scope.search.toLocation.timeZoneOffset),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.backRouteDepartureDate),
							$scope.search.toLocation.timeZoneOffset),
						1))
				: null,
				$scope.search.passengers.adults,
				$scope.search.passengers.children,
				$scope.search.passengers.infants,
				1528199921900);

			return tripQuery;
		}

		$scope.locations = [];

		$scope.search = {
			fromLocation: {},
			toLocation: {},
			forwardRouteDepartureDate: '05/26/2015',
			backRouteDepartureDate: '05/26/2015',
			twoWay: false,
			passengers: {
				adults: 1,
				children: 0,
				infants: 0
			}
		};

		$scope.searchTrips = function () {
			ticketService.searchTrips(buildTripQuery(), function (data) {
				$scope.trips = data.map(mapTripToViewModel);
			});
		}

		ticketService.getLocations(
			function (data) {
				allLocations = data;

				$scope.locations = allLocations.map(function (location) {
					var locationCode = location.getCode();

					var locationValue = {
						id: locationCode,
						text: $filter('translate')(locationCode),
						timeZoneOffset: location.getTimeZoneOffset()
					};

					return locationValue;
				});
			});
	});