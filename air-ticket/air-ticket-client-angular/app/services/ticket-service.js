/// <reference path="../../domain/Entities.js" />

angular.module('airTicketApp')
.service('ticketService', function ($http, Tickets, Locations, CONFIG) {
	var locationsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
	var tripsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();

	this.getLocations = function (callback) {
		return Locations.get(function (response) {
				var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
				var locations = response.map(function (locationDto) {
					return locationDtoConverter.convertFromDto(locationDto);
				});

				callback(locations);
			});
	}

	this.searchTrips = function (query, callback) {
		return Tickets.save(new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertToDto(query), function (data) {

			var trips = data.map(function (tripDto) {
				return tripsDtoConverter.convertFromDto(tripDto);
			});

			callback(trips);
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
})
.factory('Locations', function ($resource, CONFIG) {
	return $resource(CONFIG.serverUrl + "/api/locations/:params", {}, {
		get: {
			method: 'GET',
			isArray: true
		}
	});
});