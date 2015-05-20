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
			return new AirTicket_Domain_Entities.Location(dto._code, dto._fullName, dto._timeZoneOffset);
		};
		return LocationDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter = LocationDtoConverter;

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
				new Date(dto._arrivalTime),
				dto._code,
				dto._vendorCode,
				dto._price);

			return flight;
		};

		return FlightsDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.FlightsDtoConverter = FlightsDtoConverter;

	var FlightChainDtoConverter = (function () {
		function FlightChainDtoConverter() {
		}
		FlightChainDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		FlightChainDtoConverter.prototype.convertFromDto = function (dto) {
			var flightsJsonSerializer = new FlightsDtoConverter();
			var flights = [];
			for (var i = 0; i < dto._flights.length; i++) {
				flights.push(flightsJsonSerializer.convertFromDto(dto._flights[i]));
			}
			var route = new AirTicket_Domain_Entities.FlightChain(flights);
			return route;
		};
		return FlightChainDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.FlightChainDtoConverter = FlightChainDtoConverter;

	var TripDtoConverter = (function () {
		function TripDtoConverter() {
		}

		TripDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		TripDtoConverter.prototype.convertFromDto = function (dto) {
			var flightChainDtoConverter = new FlightChainDtoConverter();
			var trip = new AirTicket_Domain_Entities.Trip(
			    flightChainDtoConverter.convertFromDto(dto._forwardFlightChain),
			    dto._backFlightChain
					? flightChainDtoConverter.convertFromDto(dto._backFlightChain)
					: null,
				dto._adults,
				dto._children,
				dto._infants);
			return trip;
		};

		return TripDtoConverter;

	})();
	AirTicket_Domain_Entities_DtoConverters.TripDtoConverter = TripDtoConverter;

})(AirTicket_Domain_Entities_DtoConverters || (AirTicket_Domain_Entities_DtoConverters = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities_DtoConverters;
}