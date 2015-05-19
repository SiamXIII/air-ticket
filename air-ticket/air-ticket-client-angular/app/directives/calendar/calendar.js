angular.module('airTicketApp')
.directive('datepicker', function () {
	return {
		restrict: "A",
		scope: {
			ngModel: '=',
			minDate: '=',
			maxDate: '='
		},
		link: function ($scope, element, attrs) {
			element.attr('readonly', true);

			element.datepicker({
				showOnFocus: false,
				autoclose: true,
				todayBtn: "linked"
			}).on('hide', function () {
				element.focus();
			});

			element.click(function () {
				element.datepicker('show');
			});

			element.keypress(function (event) {
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if (keycode == '13') {
					element.datepicker('show');
				}
			});

			element.datepicker('setDate', $scope.ngModel);

			if ($scope.minDate) {
				$scope.$watch('minDate', function (value) {
					element.datepicker('setStartDate', new Date(value));
				});
			}

			if ($scope.maxDate) {
				$scope.$watch('maxDate', function (value) {
					element.datepicker('setEndDate', new Date(value));
				})
			}
		}
	};
})
