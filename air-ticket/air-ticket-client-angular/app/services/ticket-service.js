/// <reference path="../../domain/Entities.js" />

angular.module('airTicketApp')
.service('ticketService', function ($http, Tickets, CONFIG) {
	var locationsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
	var tripsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();

	this.getLocations = function () {
		return $http.get(CONFIG.serverUrl + "/api/locations")
			.then(function (data) {

				var result = data.data.map(function (locationDto) {
					return locationsDtoConverter.convertFromDto(locationDto);
				});

				return result;
			});
	}

	this.getLocations = function () {
		return $http.get(CONFIG.serverUrl + "/api/locations")
			.then(function (response) {
				var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
				var locations = response.data.map(function (locationDto) {
					return locationDtoConverter.convertFromDto(locationDto);
				});

				return locations;
			});
	}

	this.searchTrips = function (query, callback) {
		return Tickets.save(new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertToDto(query), function (data) {

			var trips = data.map(function (tripDto) {
				return tripsDtoConverter.convertFromDto(tripDto);
			});

			return callback(trips);
		}, function (data) {
			alert(data);
		});
	}
})
.factory('Tickets', function ($resource, CONFIG) {
	return $resource(CONFIG.serverUrl + "/api/trips/:params", {}, {
		save: {
			method: 'POST',
			isArray: true
		}
	});
});