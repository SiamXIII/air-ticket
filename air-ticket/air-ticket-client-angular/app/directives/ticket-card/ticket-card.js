angular.module('airTicketApp')
.directive('ticketCard', function (templatesPath) {
	return {
		restrict: 'E',
		template: '<div ng-include="getTemplate()"></div>',
		controller: 'ticketCardCtrl',
		scope: {
			flight: '=',
			direction: '@'
		},
		link: function ($scope, $element, $attrs) {
			$scope.getTemplate = function () {
				return templatesPath + 'ticket-card-' + $attrs.direction + '.html';
			}
		},
	}
});