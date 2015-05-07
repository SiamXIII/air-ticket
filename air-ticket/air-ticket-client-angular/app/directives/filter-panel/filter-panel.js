angular.module('airTicketApp')
.directive('filterPanel', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'filter-panel.html',
		controller: 'filterPanelCtrl',
		link: function ($scope) {
			$scope.filter = {
				forwardTrip: {
					departureMorning: false,
					departureDay: false,
					departureEvening: false
				},
				comebackTrip: {
					comebackMorning: false,
					comebackDay: false,
					comebackEvening: false
				}
			};
		}
	}
})
.filter("listFilter", function () {
	var filtersProvider = {
		departureMorning: function (item) {
			return (new Date(item.departureDate)).getHours() >= 6 && (new Date(item.departureDate)).getHours() < 12
		},
		departureDay: function (item) {
			return (new Date(item.departureDate)).getHours() >= 12 && (new Date(item.departureDate)).getHours() < 18
		},
		departureEvening: function (item) {
			return (new Date(item.departureDate)).getHours() >= 18 && (new Date(item.departureDate)).getHours() < 24
		},
		comebackMorning: function (item) {
			return (new Date(item.departureDate)).getHours() >= 6 && (new Date(item.departureDate)).getHours() < 12
		},
		comebackDay: function (item) {
			return (new Date(item.departureDate)).getHours() >= 12 && (new Date(item.departureDate)).getHours() < 18
		},
		comebackEvening: function (item) {
			return (new Date(item.departureDate)).getHours() >= 18 && (new Date(item.departureDate)).getHours() < 24
		}
	}

	function applyFilters(item, filters) {
		var result = [];

		angular.forEach(filters, function (value, filter) {
			result.push(value && filtersProvider[filter](item));
		});

		return result;
	}

	return function (items, filter, twoway) {
		var result = [];

		if (!twoway) {
			angular.forEach(items, function (item) {
				if ((!filter.forwardTrip.departureMorning && !filter.forwardTrip.departureDay && !filter.forwardTrip.departureEvening) ||
					(_.some(applyFilters(item, filter.forwardTrip)))) {
					result.push(item);
				}
			});
		}
		else {
			var preResult = [];

			angular.forEach(items, function (item) {
				if ((!filter.forwardTrip.departureMorning && !filter.forwardTrip.departureDay && !filter.forwardTrip.departureEvening) ||
					(_.some(applyFilters(item.forwardTrip, filter.forwardTrip)))) {
					preResult.push(item);
				}
			});
			angular.forEach(preResult, function (item) {
				if ((!filter.comebackTrip.departureMorning && !filter.comebackTrip.departureDay && !filter.comebackTrip.departureEvening) ||
					(_.some(applyFilters(item.comebackTrip, filter.comebackTrip)))) {
					result.push(item);
				}
			});
		}

		return result;
	};
});;