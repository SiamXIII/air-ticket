/// <reference path="entities.ts" />

var AirTicket_Domain_Entities_DtoConverters;
(function (AirTicket_Domain_Entities_DtoConverters) {

    var LocationDtoConverter = (function () {
        function LocationDtoConverter() {
        }
        LocationDtoConverter.prototype.convertToDto = function (obj) {
            return obj;
        };
        LocationDtoConverter.prototype.convertFromDto = function (dto) {
            return new AirTicket_Domain_Entities.Location(dto._code);
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

	    FlightsDtoConverter.prototype.convertFromDto = function(dto) {
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

    var TripDtoConverter = (function () {
    	function TripDtoConverter() {
    	}

    	TripDtoConverter.prototype.convertToDto = function (obj) {
    		return obj;
    	};

    	TripDtoConverter.prototype.convertFromDto = function (dto) {
    		var routeDtoConverter = new RouteDtoConverter();
    		var trip = new AirTicket_Domain_Entities.Trip(routeDtoConverter.convertFromDto(dto._forwardRoute));
		    return trip;
	    };

    	return TripDtoConverter;

    })();
    AirTicket_Domain_Entities_DtoConverters.TripDtoConverter = TripDtoConverter;

})(AirTicket_Domain_Entities_DtoConverters || (AirTicket_Domain_Entities_DtoConverters = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities_DtoConverters;
}