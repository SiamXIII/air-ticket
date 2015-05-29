var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Services;

(function (AirTicket_Domain_Services) {

	var ChainsCache = (function () {
		var cache = [];

		function ChainsCache(size) {
			if (isNaN(size) || size <= 0) {
				throw new Error('Size is invalid.');
			}

			this._size = size;
		}

		function clear() {
			var deletedItemKey;
			var minPriority = Infinity;

			for (var prop in cache) {
				if (cache[prop].priority < minPriority) {
					minPriority = cache[prop].priority;
					deletedItemKey = prop;
				}
			}

			delete cache[deletedItemKey];
		}

		ChainsCache.prototype.get = function (from, to) {
			if (cache[from + to]) {
				cache[from + to].priority += 1;
			}

			return cache[from + to];
		}

		ChainsCache.prototype.insert = function (from, to, chains) {
			if (this._size <= Object.keys(cache).length) {
				clear();
			}

			var element = chains;
			element.priority = 0;

			cache[from + to] = element;
		}

		return ChainsCache;
	})();
	AirTicket_Domain_Services.ChainsCache = ChainsCache;

	var RouteMap = (function () {

		function RouteMap(routes) {
			this._routesByLocationCode = {};
			this._locations = [];
			this._chainsCache = new AirTicket_Domain_Services.ChainsCache(2);

			for (var i = 0; i < routes.length; i++) {
				var route = routes[i];
				var fromLocationCode = route.getFromLocation().getCode();
				var toLocationCode = route.getToLocation().getCode();
				if (!this._routesByLocationCode[fromLocationCode]) {
					this._routesByLocationCode[fromLocationCode] = [];
				}

				if (!this._routesByLocationCode[fromLocationCode][toLocationCode]) {
					this._routesByLocationCode[fromLocationCode].push(route);
					this._routesByLocationCode[fromLocationCode][toLocationCode] = route;
				}

				if (this._locations.indexOf(fromLocationCode) === -1) {
					this._locations.push(fromLocationCode);
				}

				if (this._locations.indexOf(toLocationCode) === -1) {
					this._locations.push(toLocationCode);
				}
			}

		}

		RouteMap.maxRouteChainLength = 3;

		RouteMap.prototype.getLocations = function () {
			return this._locations;
		};

		RouteMap.prototype.getRoute = function (fromLocationCode, toLocationCode) {
			var route = this._routesByLocationCode[fromLocationCode][toLocationCode];
			return route;
		};

		RouteMap.prototype.buildRouteChains = function (from, to) {
			var resultChains = [];

			var startRoutes = this._routesByLocationCode[from] ? this._routesByLocationCode[from].slice() : [];

			while (startRoutes.length > 0) {
				var startRoute = startRoutes.pop();
				startRoute.nextIndex = 0;
				var chain = [startRoute];
				while (chain.length > 0) {
					var lastRoute = chain[chain.length - 1];
					var goodChain = lastRoute.getToLocation().getCode() === to;

					if (goodChain) {
						resultChains.push(new AirTicket_Domain_Entities.RouteChain(chain.slice()));
					} else {
						var routesFromLastRoute = this._routesByLocationCode[lastRoute.getToLocation().getCode()];
						var canAddRoute = chain.length < RouteMap.maxRouteChainLength &&
							routesFromLastRoute &&
							routesFromLastRoute.length > lastRoute.nextIndex;

						if (canAddRoute) {
							var addedRoute = routesFromLastRoute[lastRoute.nextIndex++];
							addedRoute.nextIndex = 0;
							chain.push(addedRoute);
							continue;
						}
					}
					delete chain.pop().nextIndex;
				}
			}

			return resultChains;
		};

		RouteMap.prototype.getRouteChains = function (from, to) {
			var chains = this._chainsCache.get(from, to);

			if (!chains) {
				chains = this.buildRouteChains(from, to);
				this._chainsCache.insert(from, to, chains);
				return this.getRouteChains(from, to);
			}
			else {
				return chains;
			}
		}

		return RouteMap;

	})();
	AirTicket_Domain_Services.RouteMap = RouteMap;

	var FlightMap = (function () {
		function FlightMap(flights, routeMap) {
			flights = flights.sort(function (a, b) { return a.getDepartureTime() - b.getDepartureTime() });
			this._routeMap = routeMap;
			this._flightsByLocationCode = {};
			this._locations = {};
			this._chainsCache = new AirTicket_Domain_Services.ChainsCache(2);

			for (var i = 0; i < flights.length; i++) {
				var flight = flights[i];
				var fromLocationCode = flight.getFromLocation().getCode();
				var toLocationCode = flight.getToLocation().getCode();
				if (!this._flightsByLocationCode[fromLocationCode]) {
					this._flightsByLocationCode[fromLocationCode] = [];
				}
				this._flightsByLocationCode[fromLocationCode].push(flight);
				if (!this._flightsByLocationCode[fromLocationCode][toLocationCode]) {
					this._flightsByLocationCode[fromLocationCode][toLocationCode] = [];
				}
				this._flightsByLocationCode[fromLocationCode][toLocationCode].push(flight);
			}
		}

		FlightMap.prototype.buildFlightMapIterator = function (fromLocationCode, toLocationCode, startDepartureDate) {
			var a = this._flightsByLocationCode[fromLocationCode][toLocationCode];

			var start;

			var l = 0;
			var r = a.length - 1;
			var m;

			while (l <= r) {
				m = Math.round((l + r) / 2);
				if (m === l && a[m].getDepartureTime() >= startDepartureDate ||
					a[m].getDepartureTime() >= startDepartureDate && a[m - 1].getDepartureTime() < startDepartureDate) {
					start = m;
					break;
				}

				if (a[m].getDepartureTime() >= startDepartureDate) {
					r = m - 1;
				} else {
					l = m + 1;
				}
			}

			var it = {
				start: start,
				curr: start,
				a: a,
				beg: function () {
					this.curr = this.start;
				},
				next: function () {
					return this.a[this.curr++];
				},
				hasNext: function () {
					return this.curr !== "undefined" &&
						this.curr < this.a.length;
				}
			};

			return it;
		}

		FlightMap.prototype.buildFlightChanes = function (flightChainQuery) {
			var allCombos = [];

			var date = new Date();
			var routeChains = this._routeMap.getRouteChains(flightChainQuery.getFromQuery().getCode(), flightChainQuery.getToQuery().getCode());
			console.log("route chains: " + (new Date() - date).toString() + "ms");

			date = new Date();
			for (var routeChainIndex = 0; routeChainIndex < routeChains.length; routeChainIndex++) {
				var routeChain = routeChains[routeChainIndex];
				var routeChainCombos = [];
				if (routeChain.getRoutesCount() > 0) {
					var route = routeChain.getRoute(0);
					var it = this.buildFlightMapIterator(
						route.getFromLocation().getCode(),
						route.getToLocation().getCode(),
						flightChainQuery.getMinDepartureTime());
					while (it.hasNext()) {
						var flight = it.next();
						if (flight.getDepartureTime() >= flightChainQuery.getMaxDepartureTime()) {
							break;
						}
						routeChainCombos.push([flight]);
					}
				}
				for (var routeIndex = 1; routeIndex < routeChain.getRoutesCount() ; routeIndex++) {
					var route = routeChain.getRoute(routeIndex);
					var newRouteChainCombos = [];
					for (var chainComboIndex = 0; chainComboIndex < routeChainCombos.length; chainComboIndex++) {
						var routeChainCombo = routeChainCombos[chainComboIndex];
						var it = this.buildFlightMapIterator(
							route.getFromLocation().getCode(),
							route.getToLocation().getCode(),
							routeChainCombo[routeChainCombo.length - 1].getArrivalTime());
						while (it.hasNext()) {
							var flight = it.next();
							if (flight.getDepartureTime() >= flightChainQuery.getMaxDepartureTime()) {
								break;
							}
							var newRouteChainCombo = routeChainCombo.slice();
							newRouteChainCombo.push(flight);
							newRouteChainCombos.push(newRouteChainCombo);
						}
					}
					routeChainCombos = newRouteChainCombos;
				}
				allCombos = allCombos.concat(routeChainCombos);
			}

			var result = allCombos.map(function (combo) { return new AirTicket_Domain_Entities.FlightChain(combo) });
			console.log("flight chains: " + (new Date() - date).toString() + "ms");
			return result;
		}

		FlightMap.prototype.getFlightChains = function (from, to) {
			var chains = this._chainsCache.get(from, to);

			if (!chains) {
				chains = this.buildFlightChanes(from, to);
				this._chainsCache.insert(from, to, chains);
				return this.getFlightChains(from, to);
			}
			else {
				return chains;
			}
		}

		return FlightMap;

	})();
	AirTicket_Domain_Services.FlightMap = FlightMap;

	var TripsService = (function () {
		function TripsService(flightMap) {
			this._flightMap = flightMap;
		}

		TripsService.prototype.getTrips = function (tripQuery) {

			var forwardFlightChains = this._flightMap.buildFlightChanes(tripQuery.GetForwardRouteQuery());

			forwardFlightChains = forwardFlightChains.filter(function (route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			});

			var trips = [];

			if (tripQuery.GetBackRouteQuery()) {
				var backFlightChains = this._flightMap.buildFlightChanes(tripQuery.GetBackRouteQuery());

				backFlightChains = backFlightChains.filter(function (route) {
					var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();
					return result;
				});

				for (var forwardChainIndex = 0; forwardChainIndex < forwardFlightChains.length; forwardChainIndex++) {
					for (var backChainIndex = 0; backChainIndex < backFlightChains.length; backChainIndex++) {
						var trip = new AirTicket_Domain_Entities.Trip(forwardFlightChains[forwardChainIndex], backFlightChains[backChainIndex], tripQuery.getAdults(), tripQuery.getChildren(), tripQuery.getInfants());
						trips.push(trip);
					}
				}
			} else {
				trips = forwardFlightChains.map(function (route) {
					var trip = new AirTicket_Domain_Entities.Trip(route, undefined, tripQuery.getAdults(), tripQuery.getChildren(), tripQuery.getInfants());
					return trip;
				});
			}

			return trips;
		}

		return TripsService;
	})();
	AirTicket_Domain_Services.TripsService = TripsService;

	var FlightGenerator = (function () {
		function FlightGenerator() {
		}

		FlightGenerator.prototype.generate = function (load, airlines, startDate, endDate) {
			var flights = [];

			for (var index = 0; index < airlines.length; index++) {
				var airline = airlines[index];
				for (var i = 0; i < load; i++) {
					var flight = new AirTicket_Domain_Entities.Flight(
						airline,
						new Date(Math.floor(startDate.valueOf() + Math.random() * (endDate - startDate))),
						'flightId' + Math.random(),
						airline.getDistanceInKm() + Math.random() * 100);
					flights.push(flight);
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