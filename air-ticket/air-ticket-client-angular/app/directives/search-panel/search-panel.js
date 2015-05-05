angular.module('airTicketApp')
.directive('searchPanel', function (templatesPath, ticketService) {
	return {
		restrict: "E",
		templateUrl: templatesPath + "search-panel.html",
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