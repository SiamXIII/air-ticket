angular.module('airTicketApp')
.directive('searchPanel', function () {
	return {
		restrict: "E",
		templateUrl: "directives/search-panel/search-panel.html",
		controller: "searchPanelCtrl"
	};
});