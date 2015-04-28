angular.module('airTicketApp', []).controller('ticketsCtrl', function ($scope, $http) {
	$http.get("http://localhost:3000/api/0.1.0/tickets").then(function(data) {
		$scope.tickets = data;
	});
});