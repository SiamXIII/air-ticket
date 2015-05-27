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

				if (!this._routesByLocationCode[fromLocationCode][toLocationCode]) {
				this._routesByLocationCode[fromLocationCode].push(route);
				this._routesByLocationCode[fromLocationCode][toLocationCode] = route;
				}

				if (this._locations.indexOf(fromLocationCode) !== -1) {
					this._locations.push(fromLocationCode);
				}

				if (this._locations.indexOf(toLocationCode) !== -1) {
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

		return RouteMap;

	})();
	AirTicket_Domain_Services.RouteMap = RouteMap;

	function FlightMapIterator(flightsByLocationCode, route, flightChainQuery, flight) {
		var fromLocationCode = route.getFromLocation().getCode();
		var toLocationCode = route.getToLocation().getCode();

		this.a = flightsByLocationCode[fromLocationCode][toLocationCode];
		this.curr;
		this.start;

		var l = 0;
		var r = this.a.length - 1;
		var m;

		if (flight) {
			while (l <= r) {
				m = Math.round((l + r) / 2);
				if (m === l && this.a[m].getDepartureTime() >= flight.getArrivalTime() ||
					this.a[m].getDepartureTime() >= flight.getArrivalTime() && this.a[m - 1].getDepartureTime() < flight.getArrivalTime()) {
					this.start = m;
					break;
				}

				if (this.a[m].getDepartureTime() >= flight.getArrivalTime()) {
					r = m - 1;
				} else {
					l = m + 1;
				}
			}
		} else {
			while (l <= r) {
				m = Math.round((l + r) / 2);
				if (m === l && this.a[m].getDepartureTime() >= flightChainQuery.getMinDepartureTime() ||
					this.a[m].getDepartureTime() >= flightChainQuery.getMinDepartureTime() &&
					this.a[m - 1].getDepartureTime() < flightChainQuery.getMinDepartureTime()) {
					this.start = m;
					break;
				}

				if (this.a[m].getDepartureTime() >= flightChainQuery.getMinDepartureTime()) {
					r = m - 1;
				} else {
					l = m + 1;
				}
			}
		}

		function beg() {
			this.curr = this.start;
		}
	
		function next() {
			return this.a[this.curr++];
		}

		function hasNext() {
			return this.start !== "undefined" &&
				this.curr < this.a.length &&
				this.a[this.curr].getDepartureTime() < flightChainQuery.getMaxDepartureTime();
		}

		this.beg = beg;
		this.next = next;
		this.hasNext = hasNext;

		this.beg();

		return this;
	}

	var FlightMap = (function () {
		function FlightMap(flights, routeMap) {
			flights = flights.sort(function(a, b) {return a.getDepartureTime() - b.getDepartureTime()});
			this._routeMap = routeMap;
			this._flightsByLocationCode = {};
			this._locations = {};

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

		FlightMap.prototype.buildFlightChanes = function (flightChainQuery) {
			var allCombos = [];
			var routeChains = this._routeMap.buildRouteChains(flightChainQuery.getFromQuery().getCode(), flightChainQuery.getToQuery().getCode());
			for (var routeChainIndex = 0; routeChainIndex < routeChains.length; routeChainIndex++) {
				var routeChain = routeChains[routeChainIndex];
				var routeChainCombos = [];
				if (routeChain.getRoutesCount() > 0) {
					var route = routeChain.getRoute(0);
					var it = new FlightMapIterator(
							this._flightsByLocationCode,
							route,
							flightChainQuery);
					while (it.hasNext()) {
						var flight = it.next();
						routeChainCombos.push([flight]);
					}
				}
				for (var routeIndex = 1; routeIndex < routeChain.getRoutesCount() ; routeIndex++) {
					var route = routeChain.getRoute(routeIndex);
					var newRouteChainCombos = [];
					for (var chainComboIndex = 0; chainComboIndex < routeChainCombos.length; chainComboIndex++) {
						var routeChainCombo = routeChainCombos[chainComboIndex];
						var it = new FlightMapIterator(
							this._flightsByLocationCode,
							route,
							flightChainQuery,
							routeChainCombo[routeChainCombo.length - 1]);
						while (it.hasNext()) {
							var flight = it.next();
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
			return result;
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

		FlightGenerator.prototype.generate = function (load, routes, startDate, endDate) {
			var routeMap = new AirTicket_Domain_Services.RouteMap(routes);
			var locations = routeMap.getLocations();
			var flights = [];

			for (var index = 0; index < routes.length; index++) {
				var route = routes[index];
				for (var i = 0; i < load; i++) {
					flights.push(new AirTicket_Domain_Entities.Flight(
						route,
						new Date(Math.floor(startDate.valueOf() + Math.random()*(startDate - endDate))),
						'mockId' + Math.random(), 'mockVendor', route.getDistanceInKm() + Math.random() * 100));
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