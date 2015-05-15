var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Queries;
(function (AirTicket_Domain_Queries) {

	var LocationQuery = (function () {
		function LocationQuery(code) {
			this._code = code;
		}

		LocationQuery.prototype.getCode = function () {
			return this._code;
		}

		return LocationQuery;
	})();
	AirTicket_Domain_Queries.LocationQuery = LocationQuery;
	
	var RouteQuery = (function () {

		function RouteQuery(fromLocationQuery, toLocationQuery, minDepartureTime, maxDepartureTime) {
			this._fromLocationQuery = fromLocationQuery;
			this._toLocationQuery = toLocationQuery;
			this._minDepartureTime = minDepartureTime;
			this._maxDepartureTime = maxDepartureTime;
		}

		RouteQuery.prototype.getFromQuery = function () {
			return this._fromLocationQuery;
		}

		RouteQuery.prototype.getToQuery = function () {
			return this._toLocationQuery;
		}

		RouteQuery.prototype.getMinDepartureTime = function () {
			return this._minDepartureTime;
		}

		RouteQuery.prototype.getMaxDepartureTime = function () {
			return this._maxDepartureTime;
		}

		return RouteQuery;
	})();
	AirTicket_Domain_Queries.RouteQuery = RouteQuery;

	var TripQuery = (function () {
		function TripQuery(forwardRouteQuery, backRouteQuery, people) {
			this._forwardRouteQuery = forwardRouteQuery;
			this._backRouteQuery = backRouteQuery;
			this._people = people;
		}

		TripQuery.prototype.GetForwardRouteQuery = function () {
			return this._forwardRouteQuery;
		}

		TripQuery.prototype.GetBackRouteQuery = function () {
			return this._backRouteQuery;
		}

		TripQuery.prototype.GetPeople = function () {
			return this._people;
		}

		return TripQuery;

	})();
	AirTicket_Domain_Queries.TripQuery = TripQuery;

})(AirTicket_Domain_Queries || (AirTicket_Domain_Queries = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Queries;
}