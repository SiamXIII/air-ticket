angular.module('airTicketApp')
.directive('searchPanel', function () {
	return {
		restrict: "E",
		templateUrl: "app/directives/search-panel/search-panel.html",
		link: {
			pre: function ($scope) {
				$scope.$watch('places', function (places) {
					if (places) {
						$scope.departureCities = places.departure;
						$scope.arrivalCities = places.arrival;
					}
				})
			}
		},
		controller: "searchPanelCtrl"
	};
});