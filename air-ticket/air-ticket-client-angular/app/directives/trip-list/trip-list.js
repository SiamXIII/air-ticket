angular.module('airTicketApp')
.directive('tripList', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'trip-list.html',
		controller: 'tripListCtrl',
		scope: {
			trips: "=",
			isLoading: '='
		}
	}
});