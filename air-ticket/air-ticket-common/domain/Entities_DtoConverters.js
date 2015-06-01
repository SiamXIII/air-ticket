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
			return new AirTicket_Domain_Entities.Location(dto._code, dto._timeZoneOffset, dto._latitude, dto._longitude);
		};
		return LocationDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter = LocationDtoConverter;

	var VendorDtoConverter = (function () {
		function VendorDtoConverter() {
		}
		VendorDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		VendorDtoConverter.prototype.convertFromDto = function (dto) {
			return new AirTicket_Domain_Entities.Vendor(dto._code, dto._name);
		};
		return VendorDtoConverter;
	})();
	AirTicket_Domain_Entities_DtoConverters.VendorDtoConverter = VendorDtoConverter;

	var RouteDtoConverter = (function () {
		function RouteDtoConverter() {
		}

		RouteDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		RouteDtoConverter.prototype.convertFromDto = function (dto) {
			var locationDtoConverter = new LocationDtoConverter();

			var route = new AirTicket_Domain_Entities.Route(locationDtoConverter.convertFromDto(dto._from),
				locationDtoConverter.convertFromDto(dto._to));

			return route;
		};

		return RouteDtoConverter;

	})();

	var AirLineDtoConverter = (function () {
		function AirLineDtoConverter() {
		}

		AirLineDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		AirLineDtoConverter.prototype.convertFromDto = function (dto) {
			var routeDtoConverter = new RouteDtoConverter();
			var vendorDtoConverter = new VendorDtoConverter();

			var route = routeDtoConverter.convertFromDto(dto._route);
			var vendor = vendorDtoConverter.convertFromDto(dto._vendor);

			var airline = new AirTicket_Domain_Entities.Airline(vendor, dto._number, route);

			return airline;
		};

		return AirLineDtoConverter;

	})();

	var FlightsDtoConverter = (function () {

		function FlightsDtoConverter() {
		}

		FlightsDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		FlightsDtoConverter.prototype.convertFromDto = function (dto) {
			var airlineDtoConverter = new AirLineDtoConverter();

			var flight = new AirTicket_Domain_Entities.Flight(
				airlineDtoConverter.convertFromDto(dto._airline),
				new Date(dto._departureTime),
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

	AirTicket_Domain_Entities_DtoConverters.AirLineDtoConverter = AirLineDtoConverter;

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