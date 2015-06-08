angular.module('airTicketApp')
.directive('searchPanel', function (templatesPath, ticketService) {
	return {
		restrict: "E",
		templateUrl: templatesPath + "search-panel.html",
		controller: "searchPanelCtrl",
		scope: {
			trips: '=',
			isLoading: '='
		}
	};
});