var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Services;

(function (AirTicket_Domain_Services) {

	var FlightMap = (function () {
		function FlightMap(flights) {
			this._flights = flights;
			this._flightsByLocationCode = {};

			for (var i = 0; i < this._flights.length; i++) {
				var flight = this._flights[i];
				var fromLocationCode = flight.getFromLocation().getCode();
				var toLocationCode = flight.getToLocation().getCode();

				if (!this._flightsByLocationCode[fromLocationCode]) {
					this._flightsByLocationCode[fromLocationCode] = { from: [], to: [] };
				}

				if (!this._flightsByLocationCode[toLocationCode]) {
					this._flightsByLocationCode[toLocationCode] = { from: [], to: [] };
				}

				this._flightsByLocationCode[fromLocationCode].from.push(flight);
				this._flightsByLocationCode[toLocationCode].to.push(flight);
			}

		}

		FlightMap.prototype.getFlightsFromLocation = function (locationCode) {
			var flights = this._flightsByLocationCode[locationCode]
				? this._flightsByLocationCode[locationCode].from
				: [];
			
			return flights;
		};

		FlightMap.prototype.getNextFlights = function (routeQuery, route) {

			var nextFlights;

			if (!route) {
				nextFlights = this.getFlightsFromLocation(routeQuery.getFromQuery().getCode());

				if (routeQuery.getMinDepartureTime()) {
					nextFlights = nextFlights.filter(function (flight) {
						return flight.getDepartureTime() >= routeQuery.getMinDepartureTime();
					});
				}

				if (routeQuery.getMaxDepartureTime()) {
					nextFlights = nextFlights.filter(function (flight) {
						return flight.getDepartureTime() < routeQuery.getMaxDepartureTime();
					});
				}
			} else {
				nextFlights = this.getFlightsFromLocation(route.getToLocation().getCode()).filter(function (flight) {
					var filter = route.getFlightsCount() < 5 &&
						flight.getDepartureTime() > route.getArrivalTime();
					return filter;
				});
			}

			return nextFlights;
		};

		FlightMap.prototype.checkForTargetReached = function (routeQuery, route) {
			var targetReached;

			if (routeQuery.getFromQuery().getCode() && routeQuery.getToQuery().getCode()) {
				targetReached =
					route.getFromLocation().getCode() === routeQuery.getFromQuery().getCode() &&
					route.getToLocation().getCode() === routeQuery.getToQuery().getCode();
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
			return new AirTicket_Domain_Entities.FlightChain(flightsArray);
		};

		FlightMap.prototype.getRoutes = function (routeQuery) {
			var routeStack = new Array();
			var startFlights = this.getNextFlights(routeQuery);
			while (startFlights.length > 0) {
				routeStack.push(new AirTicket_Domain_Entities.FlightChain([startFlights.shift()]));
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
	AirTicket_Domain_Services.FlightMap = FlightMap;

	var TripsService = (function () {
		function TripsService(flightMap) {
			this._flightMap = flightMap;
		}

		TripsService.prototype.getTrips = function (tripQuery) {

			var forwardRoutes = this._flightMap.getRoutes(tripQuery.GetForwardRouteQuery());

			forwardRoutes.filter(function (route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			})

			if (tripQuery.GetBackRouteQuery()) {
				var backRoutes = this._flightMap.getRoutes(tripQuery.GetBackRouteQuery());

				backRoutes.filter(function (route) {
					var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

					return result;
				})

				var trips = [];

				for (var forwardRouteIndex = 0; forwardRouteIndex < forwardRoutes.length; forwardRouteIndex++) {
					for (var backRouteIndex = 0; backRouteIndex < backRoutes.length; backRouteIndex++) {
						var trip = new AirTicket_Domain_Entities.Trip(forwardRoutes[forwardRouteIndex], backRoutes[backRouteIndex], tripQuery.getAdults(), tripQuery.getChildren(), tripQuery.getInfants());
						trips.push(trip);
					}
				}

				return trips;
			}

			var trips = forwardRoutes.map(function (route) {
				var trip = new AirTicket_Domain_Entities.Trip(route, undefined, tripQuery.getAdults(), tripQuery.getChildren(), tripQuery.getInfants());
				return trip;
			});

			return trips;
		}

		return TripsService;
	})();
	AirTicket_Domain_Services.TripsService = TripsService;

})(AirTicket_Domain_Services || (AirTicket_Domain_Services = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Services;
}