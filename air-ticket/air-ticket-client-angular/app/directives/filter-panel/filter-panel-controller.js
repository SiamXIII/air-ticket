angular.module('airTicketApp')
	.controller('filterPanelCtrl', function ($scope, filterFilter) {
		function isRouteFilterEmpty(routeFilter) {
			var result = !routeFilter.departureMorning &&
				!routeFilter.departureDay &&
				!routeFilter.departureEvening;

			return result;
		}

		function isRouteFiltered(route, routeFilter) {
			var result = routeFilter.departureMorning && route.departureTimeHoursLocal >= 6 && route.departureTimeHoursLocal < 12 ||
				routeFilter.departureDay && route.departureTimeHoursLocal >= 12 && route.departureTimeHoursLocal < 18 ||
				routeFilter.departureDay && route.departureTimeHoursLocal >= 18 && route.departureTimeHoursLocal < 24;

			return result;
		}

		function filterTrip(trip) {
			var result = (isRouteFilterEmpty($scope.filter.forwardRoute) || isRouteFiltered(trip.forwardRoute, $scope.filter.forwardRoute)) &&
				(!trip.backRoute || isRouteFilterEmpty($scope.filter.comebackRoute) || isRouteFiltered(trip.backRoute, $scope.filter.backRoute));

			return result;
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

		$scope.$watchCollection("trips", function () {
			$scope.filteredTrips = filterFilter($scope.trips, filterTrip);
		});

		$scope.$watch("filter", function () {
			$scope.filteredTrips = filterFilter($scope.trips, filterTrip);
		}, true);
	});