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

	Array.prototype.filterItems = function (filterGroup, targetTrip) {
		var result = [];

		angular.forEach(this, function (item) {
			var target = targetTrip ? item[targetTrip] : item;

			if ((!filterGroup.departureMorning && !filterGroup.departureDay && !filterGroup.departureEvening) ||
				(_.some(applyFilters(target, filterGroup)))) {
				result.push(item);
			}
		});

		return result;
	}

	return function (items, filter, twoway) {
		if (!twoway) {
			return items.filterItems(filter.forwardTrip);
		}
		else {
			return items.filterItems(filter.forwardTrip, "forwardTrip").filterItems(filter.comebackTrip, "comebackTrip");
		}
	};
});;