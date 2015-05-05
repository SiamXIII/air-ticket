angular.module('airTicketApp')
.directive('ticketCard', function () {
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
				return 'app/directives/ticket-card/ticket-card-' + $attrs.direction + '.html';
			}
		},
	}
});