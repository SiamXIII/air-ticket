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

			if (!(fromLocationQuery instanceof AirTicket_Domain_Queries.LocationQuery)) {
				throw new Error('From location query is invalid.');
			}
			this._fromLocationQuery = fromLocationQuery;

			if (!(toLocationQuery instanceof AirTicket_Domain_Queries.LocationQuery)) {
				throw new Error('To location query is invalid.');
			}
			this._toLocationQuery = toLocationQuery;

			if (!(minDepartureTime instanceof Date)) {
				throw new Error('Min departure time is invalid.')
			}
			this._minDepartureTime = minDepartureTime;

			if (!(maxDepartureTime instanceof Date)) {
				throw new Error('Max departure time is invalid.')
			}
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

			if (!(forwardFlightChainQuery instanceof AirTicket_Domain_Queries.FlightChainQuery)) {
				throw new Error('Forward flight chain query is invalid.');
			}
			this._forwarFlightChainQuery = forwardFlightChainQuery;

			if (backFlightChainRouteQuery) {
				if (!(backFlightChainRouteQuery instanceof AirTicket_Domain_Queries.FlightChainQuery)) {
					throw new Error('Back flight chain query is invalid.');
				}
				this._backFlightChainQuery = backFlightChainRouteQuery;
			}

			if (isNaN(adults) || adults < 0 || adults !== Math.floor(adults)) {
				throw new Error('Adults is invalid.');
			}
			this._adults = adults;

			if (isNaN(children) || children < 0 || children !== Math.floor(children)) {
				throw new Error('Children is invalid.');
			}
			this._children = children;

			if (isNaN(infants) || infants < 0 || infants !== Math.floor(infants)) {
				throw new Error('Infants is invalid.');
			}
			this._infants = infants;

			if (adults + children + infants <= 0) {
				throw new Error('People must be more then 0.');
			}

			if (isNaN(maxTransferDuration) || maxTransferDuration < 0) {
				throw new Error('Max transfer duration is invalid.');
			}
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