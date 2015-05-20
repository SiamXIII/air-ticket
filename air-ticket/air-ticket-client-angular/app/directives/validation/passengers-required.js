angular.module('airTicketApp')
.directive('passengersRequired', function () {
	return {
		restrict: "A",
		require: "ngModel",
		scope: {
			ngModel: '='
		},
		link: function ($scope, element, attributes, ngModel) {

			ngModel.$validators.passengersRequired = function (passengers) {
				var summ = 0;

				for (var passenger in passengers) {

					if ((passengers[passenger]) !== undefined && (parseInt(passengers[passenger]) != NaN))
					{
						summ += passengers[passenger];
					}
					else {
						return true;
					}
				}

				return summ > 0;
			}

			$scope.$watch('ngModel', function (value) {
				var state = ngModel.$validators.passengersRequired(value);

				ngModel.$setValidity("passengersRequired", state);
			}, true);
		}
	}
});