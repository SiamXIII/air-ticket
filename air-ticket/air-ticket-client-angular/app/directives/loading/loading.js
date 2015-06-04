angular.module('airTicketApp')
	.directive('loading', function (templatesPath, $compile, HttpInterceptor) {
		return {
			restrict: 'E',
			templateUrl: templatesPath + 'loading.html',
			controller: 'loadingController',
			scope: {
				loadingClass: '='
			},
			compile: function (scope, element, attrs) {
				return {
					pre: function (scope, element, attrs) {
						element.addClass('loading');

						if (scope.loadingClass) {
							element.addClass(scope.loadingClass);
						}

						element.hide();
					}
				}
			}
		}
	});