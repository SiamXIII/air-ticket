angular.module('airTicketApp')
	.controller('searchPanelCtrl', function(ticketService, $scope) {
		$scope.init = function() {
			$scope.search = {
				fromLocationCode: '',
				toLocationCode: ''
			};
		}

		$scope.isTwoWay = function() {
			return $scope.direction === 'twoway';
		}

		$scope.searchTrips = function() {
			ticketService.searchTrips($scope.search)
				.then(function(data) {
					$scope.trips = data;
				});
		}
	});