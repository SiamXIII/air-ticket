var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
		function Location(code, fullName, cityCode) {
			this._code = code;
			this._fullName = fullName;
			this._cityCode = cityCode;
		}

		Location.prototype.getCode = function () {
			return this._code;
		}

		Location.prototype.getFullName = function() {
			return this._fullName;
		}

		Location.prototype.getCityCode = function () {
			return this._cityCode;
		}
		return Location;
	})();
	AirTicket_Domain_Entities.Location = Location;

	var LocationQuery = (function () {
		function LocationQuery(code, cityCode) {
			this._code = code;
			this._cityCode = cityCode;
		}

		LocationQuery.prototype.getCode = function () {
			return this._code;
		}

		LocationQuery.prototype.getCityCode = function () {
			return this._cityCode;
		}
		return LocationQuery;
	})();
	AirTicket_Domain_Entities.LocationQuery = LocationQuery;

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

	var RouteQuery = (function () {

		function RouteQuery(fromLocarionQuery, toLocationQuery, minDepartureTime, maxDepartureTime) {
			this._fromLocarionQuery = fromLocarionQuery;
			this._toLocationQuery = toLocationQuery;
			this._minDepartureTime = minDepartureTime;
			this._maxDepartureTime = maxDepartureTime;
		}

		RouteQuery.prototype.getFromQuery = function() {
			return this._fromLocarionQuery;
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
	AirTicket_Domain_Entities.RouteQuery = RouteQuery;

	var FlightMap = (function () {
		function FlightMap(flights) {
			this._flights = flights;
		}

		FlightMap.prototype.getFlightsFromLocation = function (locationCode) {
			var resultFlights = [];
			for (var i = 0; i < this._flights.length; i++) {
				var flight = this._flights[i];
				if (flight.getFromLocation().getCode() === locationCode) {
					resultFlights.push(flight);
				}
			}
			return resultFlights;
		};

		FlightMap.prototype.getFlightsFromCity = function (cityCode) {
			var resultFlights = [];
			for (var i = 0; i < this._flights.length; i++) {
				var flight = this._flights[i];
				if (flight.getFromLocation().getCityCode() === cityCode) {
					resultFlights.push(flight);
				}
			}
			return resultFlights;
		};

		FlightMap.prototype.getNextFlights = function(routeQuery, route) {

			var nextFlights;

			if (!route) {
				nextFlights = routeQuery.getFromQuery().getCode()
					? this.getFlightsFromLocation(routeQuery.getFromQuery().getCode())
					: this.getFlightsFromCity(routeQuery.getFromQuery().getCityCode());

				if (routeQuery.getMinDepartureTime()) {
					nextFlights = nextFlights.filter(function(flight) {
						return flight.getDepartureTime() >= routeQuery.getMinDepartureTime();
					});
				}

				if (routeQuery.getMaxDepartureTime()) {
					nextFlights = nextFlights.filter(function(flight) {
						return flight.getDepartureTime() <= routeQuery.getMaxDepartureTime();
					});
				}
			} else {
				nextFlights = this.getFlightsFromLocation(route.getToLocation().getCode()).filter(function(flight) {
					var filter = route.getFlightsCount() < 5 &&
						flight.getDepartureTime() > route.getArrivalTime();
					return filter;
				});
			}

			return nextFlights;
		};

		FlightMap.prototype.checkForTargetReached = function(routeQuery, route) {
			var targetReached;

			if (routeQuery.getFromQuery().getCode() && routeQuery.getToQuery().getCode()) {
				targetReached =
					route.getFromLocation().getCode() === routeQuery.getFromQuery().getCode() &&
					route.getToLocation().getCode() === routeQuery.getToQuery().getCode();
			} else if (routeQuery.getFromQuery().getCityCode() && routeQuery.getToQuery().getCityCode()) {
				targetReached =
					route.getFromLocation().getCityCode() === routeQuery.getFromQuery().getCityCode() &&
					route.getToLocation().getCityCode() === routeQuery.getToQuery().getCityCode();
			} else {
				throw new Error('Bad request.');
			}

			return targetReached;
		};

		FlightMap.prototype.createNewRoute = function (route, additionalFlight) {
			var flightsArray = [];
			for (var i = 0; i < route.getFlightsCount() ; i++) {
				flightsArray.push(route.getFlight(i));
			}
			flightsArray.push(additionalFlight);
			return new Route(flightsArray);
		};

		FlightMap.prototype.getRoutes = function (routeQuery) {
			var routeStack = new Array();
			var startFlights = this.getNextFlights(routeQuery);
			while (startFlights.length > 0) {
				routeStack.push(new Route([startFlights.shift()]));
			}
			var resultRoutes = [];
			while (routeStack.length > 0) {
				var route = routeStack.pop();
				
				if (this.checkForTargetReached(routeQuery, route)) {
					resultRoutes.push(route);
				} else {
					var nextFlights = this.getNextFlights(routeQuery, route);
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

	var TripQuery = (function () {
		function TripQuery(forwardRouteQuery, backRouteQuery) {
			this._forwardRouteQuery = forwardRouteQuery;
			this._backRouteQuery = backRouteQuery;
		}

		TripQuery.prototype.GetForwardRouteQuery = function () {
			return this._forwardRouteQuery;
		}

		TripQuery.prototype.GetBackRouteQuery = function () {
			return this._backRouteQuery;
		}

		return TripQuery;

	})();
	AirTicket_Domain_Entities.TripQuery = TripQuery;

	var TripsService = (function () {
		function TripsService(flightMap) {
			this._flightMap = flightMap;
		}

		TripsService.prototype.getTrips = function (tripQuery) {

			var forwardRoutes = this._flightMap.getRoutes(tripQuery.GetForwardRouteQuery());

			if (tripQuery.backRoute) {
				var backRoutes = this._flightMap.getRoutes(tripQuery.GetBackRouteQuery());

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