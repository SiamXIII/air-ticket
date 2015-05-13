angular.module('airTicketApp')
.directive('datepicker', function () {
	return {
		link: function (scope, element, attrs) {
			element.attr('readonly', true);

			element.datepicker({
				showOnFocus: false,
				autoclose: true,
				todayBtn: "linked",
				clearBtn: true
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

			element.focusout(function () {
				//element.datepicker('hide');
			});
		},
		restrict: "A"
	};
});
