var AirTicket_Domain_Queries;

if (!AirTicket_Domain_Queries) {
	AirTicket_Domain_Queries = require("./Queries.js");
}

var AirTicket_Domain_Queries_DtoConverters;
(function (AirTicket_Domain_Queries_DtoConverters) {

	var LocationQueryDtoConverter = (function () {
		function LocationQueryDtoConverter() {
		}
		LocationQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		LocationQueryDtoConverter.prototype.convertFromDto = function (dto) {
			return new AirTicket_Domain_Queries.LocationQuery(dto._code, dto._cityCode);
		};
		return LocationQueryDtoConverter;
	})();
	AirTicket_Domain_Queries_DtoConverters.LocationQueryDtoConverter = LocationQueryDtoConverter;

	var RouteQueryDtoConverter = (function () {
		function RouteQueryDtoConverter() {
		}
		RouteQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};
		RouteQueryDtoConverter.prototype.convertFromDto = function (dto) {
			var locationQueryDtoConverter = new LocationQueryDtoConverter();

			var routeQuery = new AirTicket_Domain_Queries.RouteQuery(
			    locationQueryDtoConverter.convertFromDto(dto._fromLocarionQuery),
			    locationQueryDtoConverter.convertFromDto(dto._toLocationQuery),
			    new Date(dto._minDepartureTime),
			    new Date(dto._maxDepartureTime));

			return routeQuery;
		};
		return RouteQueryDtoConverter;
	})();
	AirTicket_Domain_Queries_DtoConverters.RouteQueryDtoConverter = RouteQueryDtoConverter;

	var TripQueryDtoConverter = (function () {
		function TripQueryDtoConverter() {
		}

		TripQueryDtoConverter.prototype.convertToDto = function (obj) {
			return obj;
		};

		TripQueryDtoConverter.prototype.convertFromDto = function (dto) {
			var routeQuqeryDtoConverter = new RouteQueryDtoConverter();
			var tripQuery = new AirTicket_Domain_Queries.TripQuery(
			    routeQuqeryDtoConverter.convertFromDto(dto._forwardRouteQuery),
			    dto._backRouteQuery
			    ? routeQuqeryDtoConverter.convertFromDto(dto._backRouteQuery)
			    : null);
			return tripQuery;
		};

		return TripQueryDtoConverter;

	})();
	AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter = TripQueryDtoConverter;

})(AirTicket_Domain_Queries_DtoConverters || (AirTicket_Domain_Queries_DtoConverters = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Queries_DtoConverters;
}