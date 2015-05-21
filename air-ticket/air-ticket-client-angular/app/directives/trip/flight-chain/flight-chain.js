angular.module('airTicketApp')
.directive('flightChain', function (templatesPath) {
	return {
		restrict: 'A',
		templateUrl: templatesPath + 'flight-chain.html',
		scope: {
			chain: "=",
		},
		controller: function ($scope) {
			$scope.detailed = false;

			$scope.toggleDetails = function () {
				$scope.detailed = $scope.detailed ? false : true;
			}
		}
	}
});