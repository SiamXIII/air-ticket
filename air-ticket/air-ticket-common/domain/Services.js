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

				var canPushNextStackItem = stack.length < 3 &&
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
		function FlightMap(flights, routeMap) {
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
			for (var routeChangeIndex = 0; routeChangeIndex < routeChains.length; routeChangeIndex++) {
				var routeChain = routeChains[routeChangeIndex];
				var chainCombo = [];
				for (var routeIndex = 0; routeIndex < routeChain.getRoutesCount() ; routeIndex++) {
					var route = routeChain.getRoute(routeIndex);
					var flights = this._flightsByLocationCode[route.getFromLocation().getCode()][route.getToLocation().getCode()];
					if (routeIndex === 0) {
						for (var flightIndex = 0; flightIndex < flights.length; flightIndex++) {
							var flight = flights[flightIndex];
							chainCombo.push([flight]);
						}
					} else {
						var newChainCombo = [];
						for (var chainComboIndex = 0; chainComboIndex < chainCombo.length; chainComboIndex++) {
							for (var flightIndex = 0; flightIndex < flights.length; flightIndex++) {
								var flight = flights[flightIndex];
								var combo = chainCombo[chainComboIndex].slice();
								combo.push(flight);
								newChainCombo.push(combo);
							}
						}
						chainCombo = newChainCombo;
					}
				}
				allCombos = allCombos.concat(chainCombo);
			}

			// TODO refactor it
			var result = allCombos
			.filter(function (combo) {
				var result = false;
				try {
					var chain = new AirTicket_Domain_Entities.FlightChain(combo);
					result = true;
				} catch (error) {
				}

				return result;
			}).map(function (combo) { return new AirTicket_Domain_Entities.FlightChain(combo) });

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

			var forwardRoutes = this._flightMap.buildFlightChanes(tripQuery.GetForwardRouteQuery());

			forwardRoutes.filter(function (route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			});

			if (tripQuery.GetBackRouteQuery()) {
				var backRoutes = this._flightMap.buildFlightChanes(tripQuery.GetBackRouteQuery());

				backRoutes.filter(function (route) {
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
					flights.push(new AirTicket_Domain_Entities.Flight(route, new Date(Math.floor(new Date().valueOf() + Math.random() * 1000 * 60 * 60 * 12)), "SOMECODE", "Aeroflot", 100 + Math.random() * 100));
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