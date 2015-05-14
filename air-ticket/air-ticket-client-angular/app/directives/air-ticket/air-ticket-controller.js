angular.module('airTicketApp')
	.controller('ticketsCtrl', function(ticketService, $scope) {
		$scope.init = function() {

			var allLocations = [];

			$scope.getAllLocations = function() {
				return allLocations;
			}

			$scope.getLocation = function(locationCode) {
				var allLocations = $scope.getAllLocations();
				for (var i = 0; i < allLocations.length; i++) {
					var location = allLocations[i];
					if (location.getCode() === locationCode) {
						return location;
					}
				}

				throw new Error("Location is not found.");
			}

			$scope.locationCodes = {};
			$scope.trips = {};

			ticketService.getLocations()
				.then(function(data) {
					allLocations = data;
					$scope.locationCodes = allLocations.map(function(location) {
						var locationCode = location.getCode();
						return locationCode;
					});
				});
		};
	});