/// <reference path="../../../domain/Entities.js" />
angular.module('airTicketApp')
	.controller('searchPanelCtrl', function (ticketService, mapTripToViewModel, $scope, $filter) {
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
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocation.getCode()),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocation.getCode()),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.forwardRouteDepartureDate),
						$scope.search.fromLocation),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.forwardRouteDepartureDate),
							$scope.search.fromLocation.getTimeZoneOffset()),
						1)),
				$scope.search.twoWay
				? new AirTicket_Domain_Queries.FlightChainQuery(
					new AirTicket_Domain_Queries.LocationQuery($scope.search.toLocation.getCode()),
					new AirTicket_Domain_Queries.LocationQuery($scope.search.fromLocation.getCode()),
					AirTicket_Utils.DateTimeUtils.setUtcOffset(
						new Date($scope.search.backRouteDepartureDate),
						$scope.search.toLocation.getTimeZoneOffset()),
					AirTicket_Utils.DateTimeUtils.addDays(
						AirTicket_Utils.DateTimeUtils.setUtcOffset(
							new Date($scope.search.backRouteDepartureDate),
							$scope.search.toLocation.getTimeZoneOffset()),
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
			fromLocation: {},
			toLocation: {},
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

		ticketService.getLocations(
			function (data) {
				allLocations = data;

				$scope.locationCodes = allLocations.map(function (location) {
					var locationCode = location.getCode();

					$scope.select2options.data.push({
						id: locationCode,
						text: $filter('translate')(locationCode)
					});

					return locationCode;
				});
			});

		$scope.select2options = {
			data: [],
			formatLoadMore: 'Loading more...',
			query: function (q) {
				var pageSize,
					results;
				pageSize = 20;
				results = _.filter(this.data, function (e) {
					return (q.term === "" || e.text.indexOf(q.term) >= 0);
				});
				q.callback({
					results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
					more: results.length >= q.page * pageSize
				});
			},
			minimumInputLength: 2
		};
	});