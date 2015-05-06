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

	return function (items, filter) {
		var result = [];

		angular.forEach(items, function (item) {
			if ((!filter.morning && !filter.day && !filter.evening) ||
				(filters.morning(item.departureDate) && filter.morning) ||
				(filters.day(item.departureDate) && filter.day) ||
				(filters.evening(item.departureDate) && filter.evening)) {
				result.push(item);
			}
		});

		return result;
	};
});;