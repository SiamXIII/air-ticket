angular.module('airTicketApp')
    .directive('filterPanel', function (templatesPath) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: templatesPath + 'filter-panel.html',
            controller: 'filterPanelCtrl',
            scope: {
                trips: "=",
                filteredTrips: "=",
                twoWay: "="
            }
        }
    });