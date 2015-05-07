angular.module('airTicketApp')
.directive('filterPanel', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'filter-panel.html',
		controller: 'filterPanelCtrl',
		link: function ($scope) {
			$scope.filter = {};
				}
		}
})
.filter("timeFilter", function () {
	var filters = {
		morning: function (time) {
			return (new Date(time)).getHours() >= 6 && (new Date(time)).getHours() < 12
		},
		day: function (time) {
			return (new Date(time)).getHours() >= 12 && (new Date(time)).getHours() < 18
		},
		evening: function (time) {
			return (new Date(time)).getHours() >= 18 && (new Date(time)).getHours() < 24
	}
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
			});
		}

		return result;
	};
});;