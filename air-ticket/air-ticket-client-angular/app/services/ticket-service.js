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

		this.getCityCodes = function() {
			return $http.get(this.serverUrl + "/api/cityCodes")
				.then(function(response) {
					return response.data;
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