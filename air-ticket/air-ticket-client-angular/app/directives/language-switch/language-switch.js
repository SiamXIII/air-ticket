angular.module('airTicketApp')
	.directive('languageSwitch', function(templatesPath) {
		return {
			restrict: 'A',
			templateUrl: templatesPath + 'language-switch.html',
			controller: function($scope, $translate, $compile) {
				$scope.getCurrentLang = function() {
					return $translate.use();
				}

				$scope.changeLang = function (lang) {
					$translate.use(lang);
					$compile($("html"))($scope);
				}
			}
		}
	});