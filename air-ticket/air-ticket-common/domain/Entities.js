var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
		function Location(code, fullName, timeZoneOffset) {
			this._code = code;
			this._fullName = fullName;
			this._timeZoneOffset = timeZoneOffset;
		}

		Location.prototype.getCode = function () {
			return this._code;
		}

		Location.prototype.getFullName = function () {
			return this._fullName;
		}

		Location.prototype.getTimeZoneOffsetMiliseconds = function () {
			var timeZoneOffset = this._timeZoneOffset * 60 * 1000;
			return timeZoneOffset;
		}

		Location.prototype.getTimeZoneString = function () {
			var operator =
				this._timeZoneOffset > 0
					? "+"
					: "-";

			var offsetString = "GMT" + operator + this._timeZoneOffset.toString();

			return offsetString;
		}

		return Location;
	})();
	AirTicket_Domain_Entities.Location = Location;

	var Flight = (function () {
		function Flight(from, to, departureTimeUtc, arrivalTimeUtc, code, vendorCode) {
			this._from = from;
			this._to = to;

			if (departureTimeUtc >= arrivalTimeUtc) {
				throw new Error("Departure time must be less than arrival time.");
			}

			this._departureTimeUtc = departureTimeUtc;
			this._arrivalTimeUtc = arrivalTimeUtc;

			this._code = code;
			this._vendorCode = vendorCode;
		}

		Flight.prototype.getFromLocation = function () {
			return this._from;
		}

		Flight.prototype.getToLocation = function () {
			return this._to;
		}

		Flight.prototype.getDepartureTimeUtc = function () {
			return this._departureTimeUtc;
		}

		Flight.prototype.getDepartureTimeLocal = function () {
			var result = this.getDepartureTimeUtc()
				.toString()
				.replace("GMT", this.getFromLocation().getTimeZoneString());

			result = new Date(result - this.getFromLocation().getTimeZoneOffsetMiliseconds());

			return result;
		}

		Flight.prototype.getArrivalTimeUtc = function () {
			return this._arrivalTimeUtc;
		}

		Flight.prototype.getArrivalTimeLocal = function () {
			var result = this.getArrivalTimeUtc()
				.toString()
				.replace("GMT", this.getFromLocation().getTimeZoneString());

			result = new Date(result - this.getFromLocation().getTimeZoneOffsetMiliseconds());

			return result;
		}

		Flight.prototype.getDuration = function () {
			return this.getArrivalTimeUtc() - this.getDepartureTimeUtc();
		}

		Flight.prototype.getCode = function () {
			return this._code;
		}

		Flight.prototype.getVendorCode = function () {
			return this._vendorCode;
		}

		return Flight;
	})();
	AirTicket_Domain_Entities.Flight = Flight;

	var Route = (function () {

		function checkFlights(flights) {
			for (var i = 1; i < flights.length; i++) {
				var prevFlight = flights[i - 1];
				var nextFlight = flights[i];

				if (prevFlight.getArrivalTimeUtc() > nextFlight.getDepartureTimeUtc()) {
					throw new Error("Route must contains only serial flights.");
				}
			}
		}

		function Route(flights) {
			checkFlights(flights);
			this._flights = flights;
		}

		Route.prototype.getFlightsCount = function () {
			return this._flights.length;
		}

		Route.prototype.getFlight = function (flightIndex) {
			return this._flights[flightIndex];
		};

		Route.prototype.getFromLocation = function () {
			return this._flights[0].getFromLocation();
		}

		Route.prototype.getToLocation = function () {
			var lastFlightIndex = this._flights.length - 1;
			return this._flights[lastFlightIndex].getToLocation();
		}

		Route.prototype.getDepartureTimeUtc = function () {
			return this.getFlight(0).getDepartureTimeUtc();
		}

		Route.prototype.getDepartureTimeLocal = function () {
			return this.getFlight(0).getDepartureTimeLocal();
		}

		Route.prototype.getArrivalTimeUtc = function () {
			return this.getFlight(this.getFlightsCount() - 1).getArrivalTimeUtc();
		}

		Route.prototype.getArrivalTimeLocal = function () {
			return this.getFlight(this.getFlightsCount() - 1).getArrivalTimeLocal();
		}

		Route.prototype.getDuration = function () {
			return this.getArrivalTimeUtc() - this.getDepartureTimeUtc();
		}

		return Route;
	})();
	AirTicket_Domain_Entities.Route = Route;

	var Trip = (function () {
		function Trip(forwardRoute, backRoute) {
			this._forwardRoute = forwardRoute;
			this._backRoute = backRoute;
		}

		Trip.prototype.getFromLocation = function () {
			return this._forwardRoute.getFromLocation();
		}

		Trip.prototype.getToLocation = function () {
			return this._forwardRoute.getToLocation();
		}

		Trip.prototype.getForwardRoute = function () {
			return this._forwardRoute;
		}

		Trip.prototype.getBackRoute = function () {
			return this._backRoute;
		}

		return Trip;
	})();
	AirTicket_Domain_Entities.Trip = Trip;

})(AirTicket_Domain_Entities || (AirTicket_Domain_Entities = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities;
}