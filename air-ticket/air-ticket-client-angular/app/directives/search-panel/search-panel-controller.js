/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function (ticketService, mapTripToViewModel, $scope) {
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
				new AirTicket_Domain_Queries.FlightChainQuery(
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
				? new AirTicket_Domain_Queries.FlightChainQuery(
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
				$scope.search.passengers.adults,
				$scope.search.passengers.children,
				$scope.search.passengers.infants,
				1528199921900);

			return tripQuery;
		}

		$scope.locationCodes = {};

		$scope.search = {
			fromLocationCode: 'CODE2965',
			toLocationCode: 'CODE2989',
			forwardRouteDepartureDate: '05/22/2015',
			backRouteDepartureDate: '05/22/2015',
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

		//ticketService.getLocations(
		//	function (data) {
		//		allLocations = data;

		//		$scope.locationCodes = allLocations.map(function (location) {
		//			var locationCode = location.getCode();
		//			return locationCode;
		//		});
		//	});

		$scope.select2options = {
			ajax: {
				url: "http://localhost:3000/api/locations",
				dataType: 'json',
				delay: 250,
				data: function (term) {
					return {
						q: term,
						page_limit: 10
					};
				},
				cache: true,
				results: function (data) {

					data = data.map(function (d) {
						return { id: d._code, text: d._code };
					});

					return {
						results: data
					};
				}
			},
			escapeMarkup: function (markup) { return markup; },
			minimumInputLength: 1,
		};
	});