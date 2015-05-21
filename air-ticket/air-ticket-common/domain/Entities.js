var moment;
if (!moment) {
	var moment = require('moment-timezone');
}

var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
		function Location(code, fullName, timeZoneOffset, latitude, longitude) {
			this._code = code;
			this._fullName = fullName;
			this._timeZoneOffset = timeZoneOffset;
			this._latitude = latitude;
			this._longitude = longitude;
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

		Location.prototype.getLatitudeInRadian = function () {
			return (this._latitude * Math.PI) / 180;
		}

		Location.prototype.getLongitudeInRadian = function () {
			return (this._longitude * Math.PI) / 180;
		}

		return Location;
	})();
	AirTicket_Domain_Entities.Location = Location;

	var Route = (function () {
		function Route(from, to) {
			this._from = from;
			this._to = to;
		}

		Route.prototype.getFromLocation = function () {
			return this._from;
		}

		Route.prototype.getToLocation = function () {
			return this._to;
		}

		Route.prototype.getDistance = function () {
			var distance = Math.abs(Math.acos(Math.sin(this._from.getLatitudeInRadian()) * Math.sin(this._to.getLatitudeInRadian()) + Math.cos(this._from.getLatitudeInRadian()) * Math.cos(this._to.getLatitudeInRadian()) * Math.cos(this._from.getLongitudeInRadian() - this._to.getLongitudeInRadian())));

			return distance;
		}

		return Route;
	})();
	AirTicket_Domain_Entities.Route = Route;

	var RouteChain = (function () {
		function RouteChain(routes) {
			this._routes = routes;
		}

		RouteChain.prototype.getRoutesCount = function () {
			return this._routes.length;
		}

		RouteChain.prototype.getRoute = function (routeIndex) {
			return this._routes[routeIndex];
		}

		return RouteChain;
	})();
	AirTicket_Domain_Entities.RouteChain = RouteChain;

	var Flight = (function () {
		function Flight(route, departureTime, code, vendorCode, price) {
			this._route = route;

			this._departureTime = departureTime;

			this._code = code;
			this._vendorCode = vendorCode;

			this._price = price;
		}

		Flight.prototype.getDistance = function () {
			return this._route.getDistance();
		}

		Flight.prototype.getToLocation = function () {
			return this._route.getToLocation();
		}

		Flight.prototype.getFromLocation = function () {
			return this._route.getFromLocation();
		}

		Flight.prototype.getDepartureTime = function () {
			return this._departureTime;
		}

		Flight.prototype.getArrivalTime = function () {
			var arrivalTime = new Date(Math.round(this.getDepartureTime().valueOf() + this.getDistance() * 100));
			return arrivalTime;
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

	var FlightChain = (function () {

		function checkFlights(flights) {
			for (var i = 1; i < flights.length; i++) {
				var prevFlight = flights[i - 1];
				var nextFlight = flights[i];

				if (prevFlight.getArrivalTime() > nextFlight.getDepartureTime()) {
					throw new Error("Route must contains only serial flights.");
				}
			}
		}

		function FlightChain(flights) {
			checkFlights(flights);
			this._flights = flights;
		}

		FlightChain.prototype.getFlightsCount = function () {
			return this._flights.length;
		}

		FlightChain.prototype.getFlight = function (flightIndex) {
			return this._flights[flightIndex];
		};

		FlightChain.prototype.getFromLocation = function () {
			return this._flights[0].getFromLocation();
		}

		FlightChain.prototype.getToLocation = function () {
			var lastFlightIndex = this._flights.length - 1;
			return this._flights[lastFlightIndex].getToLocation();
		}

		FlightChain.prototype.getDepartureTime = function () {
			return this.getFlight(0).getDepartureTime();
		}


		FlightChain.prototype.getArrivalTime = function () {
			return this.getFlight(this.getFlightsCount() - 1).getArrivalTime();
		}


		FlightChain.prototype.getDuration = function () {
			return this.getArrivalTime() - this.getDepartureTime();
		}

		FlightChain.prototype.getAdultPrice = function () {
			var price = this._flights.reduce(function (price, flight) {
				return price + flight.getAdultPrice();
			}, 0);
			return price;
		}

		FlightChain.prototype.getTransferDurationAfterFlight = function (flightCode) {
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

		FlightChain.prototype.getMaxTransferDuration = function () {
			var max = 0;

			for (var i = 0; i < this.getFlightsCount() - 1 ; i++) {
				var flight = this.getFlight(i);

				var transferDurationAfterFlight = this.getTransferDurationAfterFlight(flight.getCode());

				if (max < transferDurationAfterFlight) {
					max = transferDurationAfterFlight;
				}
			}
			return max;
		};

		return FlightChain;
	})();
	AirTicket_Domain_Entities.FlightChain = FlightChain;

	var Trip = (function () {
		function Trip(forwardFlightChain, backFlightChain, adults, children, infants) {
			this._forwardFlightChain = forwardFlightChain;
			this._backFlightChain = backFlightChain;
			this._adults = adults;
			this._children = children;
			this._infants = infants;
		}

		Trip.prototype.getFromLocation = function () {
			return this._forwardFlightChain.getFromLocation();
		}

		Trip.prototype.getToLocation = function () {
			return this._forwardFlightChain.getToLocation();
		}

		Trip.prototype.getForwardFlightChain = function () {
			return this._forwardFlightChain;
		}

		Trip.prototype.getBackFlightChain = function () {
			return this._backFlightChain;
		}

		Trip.prototype.getPrice = function () {
			return (this._backFlightChain
				? (this._forwardFlightChain.getAdultPrice() + this._backFlightChain.getAdultPrice())
				: this._forwardFlightChain.getAdultPrice()) * (this._adults + 0.9 * this._children + 0.8 * this._infants);
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