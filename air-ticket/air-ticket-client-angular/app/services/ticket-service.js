angular.module('airTicketApp')
.service('ticketService', function ($http) {
	this.serverUrl = "http://localhost:3000";

	this.getAllTickets = function () {
		return $http.get(this.serverUrl + "/api/0.1.0/tickets");
	}

	this.getPlaces = function () {
		return $http.get(this.serverUrl + "/api/0.1.0/places");
	}

	this.searchTrips = function (params) {
		return $http({
			method: 'GET',
			url: this.serverUrl + "/api/0.1.0/search-trip",
			params: params
		});
	}
});