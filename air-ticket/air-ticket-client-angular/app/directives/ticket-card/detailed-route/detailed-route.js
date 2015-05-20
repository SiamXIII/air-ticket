angular.module('airTicketApp')
.directive('detailedRoute', function (templatesPath) {
	return {
		restrict: 'A',
		require: '^ticket-list',
		templateUrl: templatesPath + 'detailed-route.html',
		scope: {
			route: "=detailedRoute",
			header: "@"
		}
	}
});