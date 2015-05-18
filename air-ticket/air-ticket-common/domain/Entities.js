var moment;
if (!moment) {
	var moment = require('moment-timezone');
}

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

		Location.prototype.getTimeZoneOffset = function () {
			var timeZoneOffset = this._timeZoneOffset;
			return timeZoneOffset;
		}

		return Location;
	})();
	AirTicket_Domain_Entities.Location = Location;

	var Flight = (function () {
		function Flight(from, to, departureTime, arrivalTime, code, vendorCode, price) {
			this._from = from;
			this._to = to;

			if (departureTime >= arrivalTime) {
				throw new Error("Departure time must be less than arrival time.");
			}

			this._departureTime = departureTime;
			this._arrivalTime = arrivalTime;

			this._code = code;
			this._vendorCode = vendorCode;

			this._price = price;
		}

		Flight.prototype.getFromLocation = function () {
			return this._from;
		}

		Flight.prototype.getToLocation = function () {
			return this._to;
		}

		Flight.prototype.getDepartureTime = function () {
			return this._departureTime;
		}

		Flight.prototype.getArrivalTime = function () {
			return this._arrivalTime;
		}

		Flight.prototype.getDuration = function () {
			return this.getArrivalTime() - this.getDepartureTime();
		}

		Flight.prototype.getCode = function () {
			return this._code;
		}

		Flight.prototype.getVendorCode = function () {
			return this._vendorCode;
		}

		Flight.prototype.getAdultPrice = function () {
			return this._price;
		}

		return Flight;
	})();
	AirTicket_Domain_Entities.Flight = Flight;

	var Route = (function () {

		function checkFlights(flights) {
			for (var i = 1; i < flights.length; i++) {
				var prevFlight = flights[i - 1];
				var nextFlight = flights[i];

				if (prevFlight.getArrivalTime() > nextFlight.getDepartureTime()) {
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

		Route.prototype.getDepartureTime = function () {
			return this.getFlight(0).getDepartureTime();
		}


		Route.prototype.getArrivalTime = function () {
			return this.getFlight(this.getFlightsCount() - 1).getArrivalTime();
		}


		Route.prototype.getDuration = function () {
			return this.getArrivalTime() - this.getDepartureTime();
		}

		Route.prototype.getAdultPrice = function () {
			var price = this._flights.reduce(function (price, flight) {
				return price + flight.getAdultPrice();
			}, 0);
			return price;
		}

		Route.prototype.getTransferDurationAfterFlight = function (flightCode) {
			var index;
			var flight;

			for (var i = 0; i < this.getFlightsCount() ; i++) {
				if (this._flights[i].getCode() == flightCode) {
					index = i;
					flight = this._flights[i];

					break;
				}
			}

			if (!flight) {
				throw new Error('Flight is not found.');
			}

			if (index == this._flights.length - 1) {
				throw new Error('This is last flight.');
			}
			else {
				return this.getFlight(index + 1).getDepartureTime().getTime() - flight.getArrivalTime().getTime();
			}
		}

		Route.prototype.getMaxTransferDuration = function () {
			var max = 0;

			for (var i = 0; i < this.getFlightsCount() - 1 ; i++) {
				var flight = this.getFlight(i);

				var transferDurationAfterFlight = this.getTransferDurationAfterFlight(this.getFlight(i).getCode());

				if (max < transferDurationAfterFlight) {
					max = transferDurationAfterFlight;
				}
			}
			return max;
		};

		return Route;
	})();
	AirTicket_Domain_Entities.Route = Route;

	var Trip = (function () {
		function Trip(forwardRoute, backRoute, adults, children, infants) {
			this._forwardRoute = forwardRoute;
			this._backRoute = backRoute;
			this._adults = adults;
			this._children = children;
			this._infants = infants;
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

		Trip.prototype.getPrice = function () {
			return (this._backRoute
				? (this._forwardRoute.getAdultPrice() + this._backRoute.getAdultPrice())
				: this._forwardRoute.getAdultPrice()) * (this._adults + 0.9 * this._children + 0.8 * this._infants);
		}

		Trip.prototype.getAdults = function () {
			return this._adults;
		}

		Trip.prototype.getChildren = function () {
			return this._children;
		}

		Trip.prototype.getInfants = function () {
			return this._infants;
		}

		return Trip;
	})();
	AirTicket_Domain_Entities.Trip = Trip;

})(AirTicket_Domain_Entities || (AirTicket_Domain_Entities = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities;
}