angular.module('airTicketApp')
	.controller('filterPanelCtrl', function($scope) {

		function isRouteFilterEmpty(routeFilter) {
			var result = !routeFilter.departureMorning &&
				!routeFilter.departureDay &&
				!routeFilter.departureEvening;

			return result;
		}

		function isRoutePassFilter(route, routeFilter) {
			var result =
				routeFilter.departureMorning && route.departureTimeHoursLocal >= 6 && route.departureTimeHoursLocal < 12 ||
				routeFilter.departureDay && route.departureTimeHoursLocal >= 12 && route.departureTimeHoursLocal < 18 ||
				routeFilter.departureDay && route.departureTimeHoursLocal >= 18 && route.departureTimeHoursLocal < 24;

			return result;
		}

		function filterTrip(trip, filter) {
			var result = (isRouteFilterEmpty(filter.forwardRoute) || isRoutePassFilter(trip.forwardRoute, filter.forwardRoute)) &&
			(!trip.backRoute || isRouteFilterEmpty(filter.comebackRoute) || isRoutePassFilter(trip.backRoute, filter.comebackRoute));

			return result;
		};

		function filterTrips(trips, filter) {
			var filteredTrips = trips.filter(function(trip) {
				var filterResult = filterTrip(trip, filter);
				return filterResult;
			});

			return filteredTrips;
		}

		$scope.filter = {
			forwardRoute: {
				departureMorning: false,
				departureDay: false,
				departureEvening: false
			},
			comebackRoute: {
				departureMorning: false,
				departureDay: false,
				departureEvening: false
			}
		};

		$scope.$watchCollection("trips", function() {
			$scope.filteredTrips = filterTrips($scope.trips, $scope.filter);
		});

		$scope.$watch("filter", function() {
			$scope.filteredTrips = filterTrips($scope.trips, $scope.filter);
		}, true);
	});