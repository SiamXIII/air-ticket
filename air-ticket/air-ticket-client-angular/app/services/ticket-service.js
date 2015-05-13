/// <reference path="../../domain/Entities.js" />

angular.module('airTicketApp')
	.service('ticketService', function($http) {
		var locationsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
		var tripsDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();

		this.serverUrl = "http://localhost:3000";

		this.getLocations = function() {
			return $http.get(this.serverUrl + "/api/locations")
				.then(function(data) {

					var result = data.data.map(function(locationDto) {
						return locationsDtoConverter.convertFromDto(locationDto);
					});

					return result;
				});
		}

		this.getLocations = function() {
			return $http.get(this.serverUrl + "/api/locations")
				.then(function(response) {
					var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
					var locations = response.data.map(function(locationDto) {
						return locationDtoConverter.convertFromDto(locationDto);
					});

					return locations;
				});
		}

		this.searchTrips = function(query) {
			return $http.post(this.serverUrl + "/api/trips", new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertToDto(query))
				.then(function(data) {
					var trips = data.data.map(function(tripDto) {
						return tripsDtoConverter.convertFromDto(tripDto);
					});

					return trips;
				});
		}
	});