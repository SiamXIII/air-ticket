var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
		function Location(code, city, fullName) {
			this._code = code;
			this._city = city;
			this._fullName = fullName;
		}

		Location.prototype.getCode = function () {
			return this._code;
		}

		return Location;
	})();
	AirTicket_Domain_Entities.Location = Location;

	var Flight = (function () {
		function Flight(from, to, departureTime, arrivalTime) {
			this._from = from;
			this._to = to;

			if (departureTime >= arrivalTime) {
				throw new Error("Departure time must be less than arrival time.");
			}

			this._departureTime = departureTime;
			this._arrivalTime = arrivalTime;
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

		return Route;
	})();
	AirTicket_Domain_Entities.Route = Route;

	var FlightMap = (function () {
		function FlightMap(flights) {
			this._flights = flights;
		}

		FlightMap.prototype.getFlightsFrom = function (locationCode) {
			var resultFlights = [];
			for (var i = 0; i < this._flights.length; i++) {
				var flight = this._flights[i];
				if (flight.getFromLocation().getCode() === locationCode) {
					resultFlights.push(flight);
				}
			}
			return resultFlights;
		};

		FlightMap.prototype.getNextFlights = function (query, route) {

			if (!route) {
				var nextFlights = this.getFlightsFrom(query.fromLocationCode);
				return nextFlights;
			}

			if (route) {
				var nextFlights = this.getFlightsFrom(route.getToLocation().getCode()).filter(function (flight) {
					var filter = route.getFlightsCount() < 5 &&
					    flight.getDepartureTime() > route.getArrivalTime();
					return filter;
				});

				return nextFlights;
			}
		};

		FlightMap.prototype.createNewRoute = function (route, additionalFlight) {
			var flightsArray = [];
			for (var i = 0; i < route.getFlightsCount() ; i++) {
				flightsArray.push(route.getFlight(i));
			}
			flightsArray.push(additionalFlight);
			return new Route(flightsArray);
		};

		//  * query: {
		//  *		fromLocationCode: "",
		//  *		toLocationCode: "",
		//	*		departureTimeStartValue: "",
		//	*		departureTimeEndValue: "",
		//	*		maxFlightsCount: "",
		//	*		maxWaitingTime: ""
		//	* }

		FlightMap.prototype.getRoutes = function (query) {
			var routeStack = new Array();
			var startFlights = this.getNextFlights(query);
			while (startFlights.length > 0) {
				routeStack.push(new Route([startFlights.shift()]));
			}
			var resultRoutes = [];
			while (routeStack.length > 0) {
				var route = routeStack.pop();
				var targetReached =
					route.getFromLocation().getCode() === query.fromLocationCode &&
					route.getToLocation().getCode() === query.toLocationCode;
				if (targetReached) {
					resultRoutes.push(route);
				} else {
					var nextFlights = this.getNextFlights(query, route);
					while (nextFlights.length > 0) {
						routeStack.push(this.createNewRoute(route, nextFlights.shift()));
					}
				}
			}
			return resultRoutes;
		};

		return FlightMap;

	})();
	AirTicket_Domain_Entities.FlightMap = FlightMap;

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

	var TripsService = (function () {
		function TripsService(flightMap) {
			this._flightMap = flightMap;
		}

		/*
		 * query{
		 *		fromLocationCode: "",
		 *		toLocationCode: "",
		 *		forwardRoute: {
		 *			departureTimeStartValue: "",
		 *			departureTimeEndValue: "",
		 *			maxFlightsCount: "",
		 *			maxWaitingTime: ""
		 *		},
		 *		backRoute: {
		 *			departureTimeStartValue: "",
		 *			departureTimeEndValue: "",
		 *			maxFlightsCount: "",
		 *			maxWaitingTime: ""
		 *		}
		 * }
		 */

		TripsService.prototype.getTrips = function (query) {

			var forwardRoutes = this._flightMap.getRoutes({
				fromLocationCode: query.fromLocationCode,
				toLocationCode: query.toLocationCode,
				departureTimeStartValue: query.forwardRoute.departureTimeStartValue,
				departureTimeEndValue: query.forwardRoute.departureTimeEndValue,
				maxFlightsCount: query.forwardRoute.maxFlightsCount,
				maxWaitingTime: query.forwardRoute.maxWaitingTime
			});

			if (query.backRoute) {
				var backRoutes = this._flightMap.getRoutes({
					fromLocationCode: query.toLocationCode,
					toLocationCode: query.fromLocationCode,
					departureTimeStartValue: query.backRoute.departureTimeStartValue,
					departureTimeEndValue: query.backRoute.departureTimeEndValue,
					maxFlightsCount: query.backRoute.maxFlightsCount,
					maxWaitingTime: query.backRoute.maxWaitingTime
				});

				var trips = [];

				for (var forwardRouteIndex = 0; forwardRouteIndex < forwardRoutes.length; forwardRouteIndex++) {
					for (var backRouteIndex = 0; backRouteIndex < backRoutes.length; backRouteIndex++) {
						var trip = new Trip(forwardRoutes[forwardRouteIndex], backRoutes[backRouteIndex]);
						trips.push(trip);
					}
				}

				return trips;
			}

			var trips = forwardRoutes.map(function (route) {
				var trip = new Trip(route);
				return trip;
			});

			return trips;
		}

		return TripsService;
	})();
	AirTicket_Domain_Entities.TripsService = TripsService;

})(AirTicket_Domain_Entities || (AirTicket_Domain_Entities = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities;
}