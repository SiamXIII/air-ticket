angular.module('airTicketApp')
.directive('route', function (templatesPath) {
	return {
		restrict: 'A',
		require: '^ticket-list',
		templateUrl: templatesPath + 'route.html',
		scope: {
			route: "="
		}
	}
});