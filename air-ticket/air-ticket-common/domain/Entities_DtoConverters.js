var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Entities_DtoConverters;
(function (AirTicket_Domain_Entities_DtoConverters) {

	var LocationDtoConverter = (function () {
		function LocationDtoConverter() {
		}
		LocationDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		LocationDtoConverter.prototype.convertFromDto = function (dto) {
			return new AirTicket_Domain_Entities.Location(dto._code, dto._fullName, dto._cityCode);
		};
		return LocationDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter = LocationDtoConverter;

	var LocationQueryDtoConverter = (function () {
		function LocationQueryDtoConverter() {
		}
		LocationQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		LocationQueryDtoConverter.prototype.convertFromDto = function (dto) {
			return new AirTicket_Domain_Entities.LocationQuery(dto._code, dto._cityCode);
		};
		return LocationQueryDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.LocationQueryDtoConverter = LocationQueryDtoConverter;

	var FlightsDtoConverter = (function () {

		function FlightsDtoConverter() {
		}

		FlightsDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		FlightsDtoConverter.prototype.convertFromDto = function (dto) {
			var locationDtoConverter = new LocationDtoConverter();

			var flight = new AirTicket_Domain_Entities.Flight(
				locationDtoConverter.convertFromDto(dto._from),
				locationDtoConverter.convertFromDto(dto._to),
				new Date(dto._departureTime),
				new Date(dto._arrivalTime));

			return flight;
		};

		return FlightsDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.FlightsDtoConverter = FlightsDtoConverter;

	var RouteDtoConverter = (function () {
		function RouteDtoConverter() {
		}
		RouteDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		RouteDtoConverter.prototype.convertFromDto = function (dto) {
			var flightsJsonSerializer = new FlightsDtoConverter();
			var flights = [];
			for (var i = 0; i < dto._flights.length; i++) {
				flights.push(flightsJsonSerializer.convertFromDto(dto._flights[i]));
			}
			var route = new AirTicket_Domain_Entities.Route(flights);
			return route;
		};
		return RouteDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.RouteDtoConverter = RouteDtoConverter;

	var RouteQueryDtoConverter = (function () {
		function RouteQueryDtoConverter() {
		}
		RouteQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		RouteQueryDtoConverter.prototype.convertFromDto = function (dto) {
			var locationQueryDtoConverter = new LocationQueryDtoConverter();

			var routeQuery = new AirTicket_Domain_Entities.RouteQuery(
			    locationQueryDtoConverter.convertFromDto(dto._fromLocarionQuery),
			    locationQueryDtoConverter.convertFromDto(dto._toLocationQuery),
			    new Date(dto._minDepartureTime),
			    new Date(dto._maxDepartureTime));

			return routeQuery;
		};
		return RouteQueryDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.RouteQueryDtoConverter = RouteQueryDtoConverter;

	var TripDtoConverter = (function () {
		function TripDtoConverter() {
		}

		TripDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		TripDtoConverter.prototype.convertFromDto = function (dto) {
			var routeDtoConverter = new RouteDtoConverter();
			var trip = new AirTicket_Domain_Entities.Trip(
			    routeDtoConverter.convertFromDto(dto._forwardRoute),
			    dto._backRoute
					? routeDtoConverter.convertFromDto(dto._backRoute)
					: null);
			return trip;
		};

		return TripDtoConverter;

	})();
	AirTicket_Domain_Entities_DtoConverters.TripDtoConverter = TripDtoConverter;

	var TripQueryDtoConverter = (function () {
		function TripQueryDtoConverter() {
		}

		TripQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		TripQueryDtoConverter.prototype.convertFromDto = function (dto) {
			var routeQuqeryDtoConverter = new RouteQueryDtoConverter();
			var tripQuery = new AirTicket_Domain_Entities.TripQuery(
			    routeQuqeryDtoConverter.convertFromDto(dto._forwardRouteQuery),
			    dto._backRouteQuery
			    ? routeQuqeryDtoConverter.convertFromDto(dto._backRouteQuery)
			    : null);
			return tripQuery;
		};

		return TripQueryDtoConverter;

	})();
	AirTicket_Domain_Entities_DtoConverters.TripQueryDtoConverter = TripQueryDtoConverter;

})(AirTicket_Domain_Entities_DtoConverters || (AirTicket_Domain_Entities_DtoConverters = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities_DtoConverters;
}