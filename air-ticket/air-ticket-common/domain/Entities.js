var moment;
if (!moment) {
	var moment = require('moment-timezone');
}

var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
		function Location(code, fullName, timeZoneOffset, latitude, longitude) {
			if (!code) {
				throw new Error('Code is invalid.')
			}
			this._code = code;

			if (!fullName) {
				throw new Error('Full name is invalid.')
			}
			this._fullName = fullName;

			if (isNaN(timeZoneOffset) || timeZoneOffset < -720 || timeZoneOffset > 840 || timeZoneOffset % 30 != 0) {
				throw new Error('Time zone offset is invalid.')
			}
			this._timeZoneOffset = timeZoneOffset;

			if (isNaN(latitude)) {
				throw new Error('Latitude is invalid.')
			}
			this._latitude = latitude;

			if (isNaN(longitude)) {
				throw new Error('Longitude is invalid.')
			}
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

	var Airline = (function () {
		function Airline(code, vendorCode, route) {
			this._code = code;
			this._vendorCode = vendorCode;
			this._route = route;
		}

		Airline.prototype.getCode = function () {
			return this._code;
		}

		Airline.prototype.getVendorCode = function () {
			return this._vendorCode;
		}

		Airline.prototype.getRoute = function () {
			return this._route;
		}

		Airline.prototype.getToLocation = function () {
			return this.getRoute().getToLocation();
		}

		Airline.prototype.getFromLocation = function () {
			return this.getRoute().getFromLocation();
		}

		Airline.prototype.getDistanceInKm = function () {
			return this.getRoute().getDistanceInKm();
		}

		return Airline;
	})();
	AirTicket_Domain_Entities.Airline = Airline;

	var Route = (function () {
		function Route(from, to) {

			if (!(from instanceof AirTicket_Domain_Entities.Location)) {
				throw new Error('From location is invalid.')
			}
			this._from = from;

			if (!(to instanceof AirTicket_Domain_Entities.Location)) {
				throw new Error('To location is invalid.')
			}
			this._to = to;
		}

		Route.prototype.getFromLocation = function () {
			return this._from;
		}

		Route.prototype.getToLocation = function () {
			return this._to;
		}

		Route.prototype.getDistanceInKm = function () {
			var radious = 6371;

			var distance = Math.abs(Math.acos(Math.sin(this._from.getLatitudeInRadian()) * Math.sin(this._to.getLatitudeInRadian()) + Math.cos(this._from.getLatitudeInRadian()) * Math.cos(this._to.getLatitudeInRadian()) * Math.cos(this._from.getLongitudeInRadian() - this._to.getLongitudeInRadian()))) * radious;

			return distance;
		}

		return Route;
	})();
	AirTicket_Domain_Entities.Route = Route;

	var RouteChain = (function () {
		function RouteChain(routes) {

			if (!Array.isArray(routes)) {
				throw new Error('Routes is invalid.')
			}
			this._routes = routes;
		}

		RouteChain.prototype.getRoutesCount = function () {
			return this._routes.length;
		}

		RouteChain.prototype.getRoute = function (routeIndex) {
			return this._routes[routeIndex];
		}

		RouteChain.prototype.getDistanceInKm = function () {
			var distance = 0;
			for (var i = 0; i < this.getRoutesCount() ; i++) {
				distance += this.getRoute(i).getDistanceInKm();
			}

			return distance;
		}

		return RouteChain;
	})();
	AirTicket_Domain_Entities.RouteChain = RouteChain;

	var Flight = (function () {
		function Flight(airline, departureTime, code, price) {

			if (!(airline instanceof AirTicket_Domain_Entities.Airline)) {
				throw new Error('AirLine is invalid.')
			}
			this._airline = airline;

			if (!(departureTime instanceof Date)) {
				throw new Error('Departure time is invalid.')
			}
			this._departureTime = departureTime;

			if (!code) {
				throw new Error('Code is invalid.')
			}
			this._code = code;

			if (isNaN(price)) {
				throw new Error('Price is invalid.');
			}
			this._price = price;
		}

		Flight.prototype.getDistanceInKm = function () {
			return this._airline.getDistanceInKm();
		}

		Flight.prototype.getToLocation = function () {
			return this._airline.getToLocation();
		}

		Flight.prototype.getFromLocation = function () {
			return this._airline.getFromLocation();
		}

		Flight.prototype.getDepartureTime = function () {
			return this._departureTime;
		}

		Flight.prototype.getArrivalTime = function () {
			var arrivalTime = new Date(Math.round(this.getDepartureTime().valueOf() + (this.getDistanceInKm() / 1080) * 60 * 60 * 1000));
			return arrivalTime;
		}

		Flight.prototype.getDuration = function () {
			return this.getArrivalTime() - this.getDepartureTime();
		}

		Flight.prototype.getCode = function () {
			return this._code;
		}

		Flight.prototype.getVendorCode = function () {
			return this._airline.getVendorCode();
		}

		Flight.prototype.getAdultPrice = function () {
			return this._price;
		}

		Flight.prototype.getAirLineCode = function () {
			return this._airline.getCode();
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
			if (!Array.isArray(flights)) {
				throw new Error('Flights is invalid.');
			}
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
				if (this._flights[i].getCode() === flightCode) {
					index = i;
					flight = this._flights[i];

					break;
				}
			}

			if (!flight) {
				throw new Error('Flight is not found.');
			}

			if (index === this._flights.length - 1) {
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

		FlightChain.prototype.getHash = function () {
			var hash = this.getDepartureTime().toString();
			for (var i = 0; i < this.getFlightsCount() ; i++) {
				var flightCode = this.getFlight(i).getCode();
				hash += flightCode;
			}
			return hash;
		};

		FlightChain.prototype.isEqual = function (flightChain) {
			return this.getHash() === flightChain.getHash();
		};

		return FlightChain;
	})();
	AirTicket_Domain_Entities.FlightChain = FlightChain;

	var Trip = (function () {
		function Trip(forwardFlightChain, backFlightChain, adults, children, infants) {
			if (!(forwardFlightChain instanceof AirTicket_Domain_Entities.FlightChain)) {
				throw new Error('Forward flight chain is invalid.');
			}
			this._forwardFlightChain = forwardFlightChain;

			if (!(backFlightChain instanceof AirTicket_Domain_Entities.FlightChain)) {
				throw new Error('Back flight chain is invalid.');
			}
			this._backFlightChain = backFlightChain;

			if (!isNaN(adults) || adults < 0 || adults !== Math.floor(adults)) {
				throw new Error('Adults is invalid.');
			}
			this._adults = adults;

			if (!isNaN(children) || children < 0 || children !== Math.floor(children)) {
				throw new Error('Children is invalid.');
			}
			this._children = children;

			if (!isNaN(infants) || infants < 0 || infants !== Math.floor(infants)) {
				throw new Error('Infants is invalid.');
			}
			this._infants = infants;

			if (adults + children + infants <= 0) {
				throw new Error('People must be more then 0.');
			}
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