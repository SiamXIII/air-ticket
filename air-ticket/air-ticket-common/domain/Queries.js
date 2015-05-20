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

	var FlightChainQuery = (function () {

		function FlightChainQuery(fromLocationQuery, toLocationQuery, minDepartureTime, maxDepartureTime) {
			this._fromLocationQuery = fromLocationQuery;
			this._toLocationQuery = toLocationQuery;
			this._minDepartureTime = minDepartureTime;
			this._maxDepartureTime = maxDepartureTime;
		}

		FlightChainQuery.prototype.getFromQuery = function () {
			return this._fromLocationQuery;
		}

		FlightChainQuery.prototype.getToQuery = function () {
			return this._toLocationQuery;
		}

		FlightChainQuery.prototype.getMinDepartureTime = function () {
			return this._minDepartureTime;
		}

		FlightChainQuery.prototype.getMaxDepartureTime = function () {
			return this._maxDepartureTime;
		}

		return FlightChainQuery;
	})();
	AirTicket_Domain_Queries.FlightChainQuery = FlightChainQuery;

	var TripQuery = (function () {
		function TripQuery(forwardFlightChainQuery, backFlightChainRouteQuery, adults, children, infants, maxTransferDuration) {
			this._forwarFlightChainQuery = forwardFlightChainQuery;
			this._backFlightChainQuery = backFlightChainRouteQuery;
			this._adults = adults;
			this._children = children;
			this._infants = infants;
			this._maxTransferDuration = maxTransferDuration;
		}

		TripQuery.prototype.GetForwardRouteQuery = function () {
			return this._forwarFlightChainQuery;
		}

		TripQuery.prototype.GetBackRouteQuery = function () {
			return this._backFlightChainQuery;
		}

		TripQuery.prototype.getAdults = function () {
			return this._adults;
		}

		TripQuery.prototype.getChildren = function () {
			return this._children;
		}

		TripQuery.prototype.getInfants = function () {
			return this._infants;
		}

		TripQuery.prototype.getMaxTransferDuration = function () {
			return this._maxTransferDuration;
		}

		return TripQuery;

	})();
	AirTicket_Domain_Queries.TripQuery = TripQuery;

})(AirTicket_Domain_Queries || (AirTicket_Domain_Queries = {}));


if (module && module.exports) {
	module.exports = AirTicket_Domain_Queries;
}