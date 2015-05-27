angular.module('airTicketApp')
	.directive('dropdownSelect2', function () {
		return {
			restrict: "A",
			scope: {
				filter: '=',
				dropdown: '='
			},
			link: function (scope, element, attrs) {

				scope.$watch('dropdown', function (value) {
					element.select2({
						data: value,
						query: function (q) {
							var pageSize = 20;
							var results

							if (q.term && q.term !== "") {
								results = _.filter(this.data, function (e) {

									if (scope.filter) {
										return scope.filter.text != e.text && e.text.indexOf(q.term) >= 0;
									}
									else {
										return e.text.indexOf(q.term) >= 0;
									}
								});
							}
							else {
								return;
							}

							q.callback({
								results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
								more: results.length >= q.page * pageSize
							});
						},
						minimumInputLength: 2,
					});
				});
			}
		}
	});