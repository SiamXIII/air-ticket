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
	});