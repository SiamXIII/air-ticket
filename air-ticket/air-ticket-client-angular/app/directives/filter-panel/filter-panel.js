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
			var correctedTime = (item.departureTime.utc().hour() + +item.from.timeZoneOffset) % 24;

			return correctedTime >= 6 && correctedTime < 12
		},
		departureDay: function (item) {
			var correctedTime = (item.departureTime.utc().hour() + +item.from.timeZoneOffset) % 24;

			return correctedTime >= 12 && correctedTime < 18
		},
		departureEvening: function (item) {
			var correctedTime = (item.departureTime.utc().hour() + +item.from.timeZoneOffset) % 24;

			return correctedTime >= 18 && correctedTime < 24
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
})
.filter('localized', function () {
	return function (item, correction) {
		return moment(item).utc().add(correction, 'h').format('HH:mm');
	}
});