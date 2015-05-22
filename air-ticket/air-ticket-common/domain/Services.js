var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Services;

(function (AirTicket_Domain_Services) {
	var RouteMap = (function () {

		function RouteMap(routes) {
			this._routesByLocationCode = {};
			this._locations = [];
			
			for (var i = 0; i < routes.length; i++) {
				var route = routes[i];
				var fromLocationCode = route.getFromLocation().getCode();
				var toLocationCode = route.getToLocation().getCode();
				if (!this._routesByLocationCode[fromLocationCode]) {
					this._routesByLocationCode[fromLocationCode] = [];
				}
				this._routesByLocationCode[fromLocationCode].push(route);
				this._routesByLocationCode[fromLocationCode][toLocationCode] = route;

				if (this._locations.indexOf(fromLocationCode) !== -1) {
					this._locations.push(fromLocationCode);
				}

				if (this._locations.indexOf(toLocationCode) !== -1) {
					this._locations.push(toLocationCode);
				}

			}
		}

		RouteMap.prototype.getLocations = function () {
			return this._locations;
		};

		RouteMap.prototype.getRoute = function (fromLocationCode, toLocationCode) {
			var route = this._routesByLocationCode[fromLocationCode][toLocationCode];
			return route;
		};

		RouteMap.prototype.buildRouteChains = function (from, to) {
			var resultChains = [];
			 
			var stack = [{ locationCode: from, nextLocationIndex: 0 }];

			while (stack.length > 0) {

				var topItem = stack[stack.length - 1];

				var canPushNextStackItem = stack.length < 6 &&
					this._routesByLocationCode[topItem.locationCode] &&
					this._routesByLocationCode[topItem.locationCode].length > topItem.nextLocationIndex;

				if (canPushNextStackItem) {
					var addedLocationCode = this._routesByLocationCode[topItem.locationCode][topItem.nextLocationIndex].getToLocation().getCode();

					stack[stack.length - 1].nextLocationIndex++;
					stack.push({ locationCode: addedLocationCode, nextLocationIndex: 0 });
					continue;
				}

				var goodChain = topItem.locationCode === to;

				if (goodChain) {
					var chain = [];
					for (var i = 1; i < stack.length; i++) {
						chain.push(this.getRoute(stack[i - 1].locationCode, stack[i].locationCode));
					}

					resultChains.push(chain);
				}

				stack.pop();
			}

			return resultChains.map(function(chain) { return new AirTicket_Domain_Entities.RouteChain(chain) });
		};

		return RouteMap;

	})();
	AirTicket_Domain_Services.RouteMap = RouteMap;

	var FlightMap = (function () {
		function FlightMap(flights) {
			this._flights = flights.slice();
		}

		function filterFlights(flights, flightChainQuery) {
			var filteredFlights = flights.filter(function(flight) {
				var result = flight.getDepartureTime() > flightChainQuery.getMinDepartureTime() &&
					flight.getDepartureTime() < flightChainQuery.getMaxDepartureTime();
				return result;
			});

			return filteredFlights;
		}

		function initFlightGraf(flights) {
			var graf = {};
			for (var i = 0; i < flights.length; i++) {
				var flight = flights[i];
				var fromLocationCode = flight.getFromLocation().getCode();
				var toLocationCode = flight.getToLocation().getCode();
				if (!graf[fromLocationCode]) {
					graf[fromLocationCode] = [];
				}
				graf[fromLocationCode].push(flight);
				if (!graf[fromLocationCode][toLocationCode]) {
					graf[fromLocationCode][toLocationCode] = [];
				}
				graf[fromLocationCode][toLocationCode].push(flight);
			}

			return graf;
		}

		function reachedDestination(chain, flightChainQuery) {
			var result = chain.getToLocation().getCode() === flightChainQuery.getToQuery().getCode();
			return result;
		}

		function pushStartValuesToQueue(queue, graf, flightChainQuery) {
			var flights = graf[flightChainQuery.getFromQuery().getCode()];
			if (flights) {
				for (var i = 0; i < flights.length; i++) {
					var chain = new AirTicket_Domain_Entities.FlightChain([flights[i]]);
					queue.push(chain);
				}
			}
		}

		function pushNextChains(queue, chain, graf) {
			var fromFlights = graf[chain.getToLocation().getCode()];
			var addedFlights = fromFlights 
				? fromFlights.filter(function (flight) { return flight.getDepartureTime() > chain.getArrivalTime() })
				: [];
			for (var i = 0; i < addedFlights.length; i++) {
				var flightsFforChain = [];
				for (var flightIndex = 0; flightIndex < chain.getFlightsCount(); flightIndex++) {
					flightsFforChain.push(chain.getFlight(flightIndex));
				}
				flightsFforChain.push(addedFlights[i]);
				var addedChain = new AirTicket_Domain_Entities.FlightChain(flightsFforChain);
				queue.push(addedChain);
			}
		}

		FlightMap.prototype.buildFlightChanes = function (flightChainQuery) {

			var flights = filterFlights(this._flights, flightChainQuery);
			var graf = initFlightGraf(flights);

			var queue = [];

			pushStartValuesToQueue(queue, graf, flightChainQuery);

			var goodChains = {};

			while (queue.length > 0) {
				var chain = queue.shift();

				var canBeFasters = !goodChains.fastersChain ||
					chain.getDuration() < goodChains.fastersChain.getDuration();

				var canBeCheapest = !goodChains.cheapestChain ||
					chain.getAdultPrice() < goodChains.cheapestChain.getAdultPrice();

				if (reachedDestination(chain, flightChainQuery)) {
					
					if (canBeFasters) {
						goodChains.fastersChain = chain;
					}
					if (canBeCheapest) {
						goodChains.cheapestChain = chain;
					}
				} else {
					if ((canBeFasters || canBeCheapest) && chain.getFlightsCount() < 3) {
						pushNextChains(queue, chain, graf);
					}
				}
			}

			var chains = [goodChains.fastersChain];
			if (!goodChains.cheapestChain.isEqual(goodChains.fastersChain)) {
				chains.push(goodChains.cheapestChain);
			}

			return chains;
		}

		return FlightMap;

	})();
	AirTicket_Domain_Services.FlightMap = FlightMap;

	var TripsService = (function () {
		function TripsService(flightMap) {
			this._flightMap = flightMap;
		}

		TripsService.prototype.getTrips = function (tripQuery) {

			var forwardRoutes = this._flightMap.buildFlightChanes(tripQuery.GetForwardRouteQuery());

			forwardRoutes = forwardRoutes.filter(function (route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			});

			if (tripQuery.GetBackRouteQuery()) {
				var backRoutes = this._flightMap.buildFlightChanes(tripQuery.GetBackRouteQuery());

				backRoutes = backRoutes.filter(function (route) {
					var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

					return result;
				});

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

	var FlightGenerator = (function () {
		function FlightGenerator() {
		}

		FlightGenerator.prototype.generate = function (load, routes) {
			var routeMap = new AirTicket_Domain_Services.RouteMap(routes);
			var locations = routeMap.getLocations();
			var flights = [];

			for (var index = 0; index < routes.length; index++) {
				var route = routes[index];
				for (var i = 0; i < load; i++) {
					flights.push(new AirTicket_Domain_Entities.Flight(route, new Date(Math.floor(new Date().valueOf() + Math.random() * 1000 * 60 * 60 * 12)), "SOMECODE"+Math.random(), "Aeroflot", route.getDistanceInKm() + Math.random() * 100));
				}
			}

			return flights;
		}

		return FlightGenerator;
	})();
	AirTicket_Domain_Services.FlightGenerator = FlightGenerator;

})(AirTicket_Domain_Services || (AirTicket_Domain_Services = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Services;
}