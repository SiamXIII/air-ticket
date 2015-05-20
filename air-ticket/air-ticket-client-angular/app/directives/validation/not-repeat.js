angular.module('airTicketApp')
.directive('notRepeat', ['$parse', function ($parse) {
	return {
		restrict: "A",
		require: "ngModel",
		scope: {
			ngModel: '='
		},
		link: function ($scope, element, attributes, ngModel) {
			ngModel.$validators.notRepeat = function (modelValue) {
				return modelValue != $parse(attributes.notRepeat)($scope);
			}

			$scope.$watch('ngModel', function (value) {
				var state = ngModel.$validators.notRepeat(attributes.ngModel);

				ngModel.$setValidity("notRepeat", state);
			});
		}
	}
}]);