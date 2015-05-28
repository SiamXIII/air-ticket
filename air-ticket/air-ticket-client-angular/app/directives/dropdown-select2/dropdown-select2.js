angular.module('airTicketApp')
	.directive('dropdownSelect2', function (templatesPath, $compile) {
		return {
			restrict: "A",
			scope: {
				filter: '=',
				items: '=',
				model: "=ngModel"
			},
			compile: function (element, attrs) {

				element.attr("ui-select2", "options");
				element.removeAttr("dropdown-select2");

				return {
					post: function(scope, element) {
						element.on('select2-selected', function (eventData) {
							if (eventData.choice) {
								scope.model = eventData.choice;
							}
						});
					},
					pre: function (scope) {
						scope.options = {
							data: scope.items,
							query: function (q) {
								var pageSize = 20;
								var results;

								if (q.term && q.term !== "") {
									results = _.filter(this.data, function (e) {

										if (scope.filter) {
											return scope.filter.text != e.text && e.text.indexOf(q.term) >= 0;
										} else {
											return e.text.indexOf(q.term) >= 0;
										}
									});
								} else {
									return;
								}

								q.callback({
									results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
									more: results.length >= q.page * pageSize
								});
							},
							minimumInputLength: 2
						};

						scope.$watch('items', function (value) {
							scope.options.data.splice(0);
							value.map(function (val) {
								scope.options.data.push(val);
							});
						});

						$compile(element)(scope);
					}
				};
			}
		}
	});