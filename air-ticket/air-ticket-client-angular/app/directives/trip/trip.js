angular.module('airTicketApp')
.directive('trip', function (templatesPath) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: templatesPath + 'trip.html',
		controller: 'tripCtrl'
	}
});