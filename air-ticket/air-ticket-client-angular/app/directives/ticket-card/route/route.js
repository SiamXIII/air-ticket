angular.module('airTicketApp')
.directive('route', function (templatesPath) {
	return {
		restrict: 'A',
		require: '^ticket-list',
		templateUrl: templatesPath + 'route.html',
		scope: {
			route: "=",
		},
		controller: function ($scope) {
			$scope.detailed = false;

			$scope.toggleDetails = function () {
				$scope.detailed = $scope.detailed ? false : true;
			}
		}
	}
});