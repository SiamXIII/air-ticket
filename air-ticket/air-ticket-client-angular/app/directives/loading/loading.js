angular.module('airTicketApp')
	.directive('loading', function (templatesPath) {
		return {
			restrict: 'A',
			templateUrl: templatesPath + 'loading.html',
			controller: 'loadingController',
			transclude: true,
			scope: {
				loading: '='
			},
			compile: function (scope, element, attrs) {
				return {
					pre: function (scope, element, attrs, ctrl, transclude) {
						element.children().addClass('loading')

						transclude(function (clone) {
							element.append(clone);
						});	

						element.find('.loading').css('left', (element.position().left + element.width()) / 2 + 'px');
						element.find('.loading').css('top', (element.position().top + element.height()) / 2 + 'px');

						scope.$watch("loading", function (value) {
							if (value) {
								element.find('.loading').show();
							}
							else {
								element.find('.loading').hide();
							}
						});
					}
				}
			}
		}
	});
