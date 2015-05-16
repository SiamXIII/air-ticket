angular.module('airTicketApp')
	.directive('filterPanel', function(templatesPath) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: templatesPath + 'filter-panel.html',
			controller: 'filterPanelCtrl'
		}
	})
	.filter('localized', function() {
		return function(item, correction) {
			return moment(item).utc().add(correction, 'm').format('HH:mm');
		}
	});