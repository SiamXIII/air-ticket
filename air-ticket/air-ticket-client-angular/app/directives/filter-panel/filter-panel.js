angular.module('airTicketApp')
	.directive('filterPanel', function (templatesPath) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: templatesPath + 'filter-panel.html',
			controller: 'filterPanelCtrl',
			link: function ($scope) {
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
			}
		}
	})
.filter("listFilter", function () {
	var filtersProvider = {
		departureMorning: function (item) {
			return (new Date(item.departureTime)).getHours() >= 6 && (new Date(item.departureTime)).getHours() < 12
		},
		departureDay: function (item) {
			return (new Date(item.departureTime)).getHours() >= 12 && (new Date(item.departureTime)).getHours() < 18
		},
		departureEvening: function (item) {
			return (new Date(item.departureTime)).getHours() >= 18 && (new Date(item.departureTime)).getHours() < 24
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
			if ((!filterGroup.departureMorning && !filterGroup.departureDay && !filterGroup.departureEvening) ||
				(_.some(applyFilters(item[targetTrip], filterGroup)))) {
				result.push(item);
			}
		});

		return result;
	}

	return function (items, filter) {

		return _.some(items)
			? _.every(items.map(function (trip) { return trip.backRoute; }))
					? items.filterItems(filter.forwardRoute, "forwardRoute").filterItems(filter.comebackRoute, "backRoute")
					: items.filterItems(filter.forwardRoute, "forwardRoute")
			: null;
	}
});