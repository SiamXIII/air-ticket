﻿var AirTicket_Domain_Entities;

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

		RouteMap.maxRouteChainLength = 4;

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

				var canPushNextStackItem = stack.length < RouteMap.maxRouteChainLength &&
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
			for (var routeChainIndex = 0; routeChainIndex < routeChains.length; routeChainIndex++) {
				var routeChain = routeChains[routeChainIndex];
				var routeChainCombos = [];
				for (var routeIndex = 0; routeIndex < routeChain.getRoutesCount() ; routeIndex++) {
					var route = routeChain.getRoute(routeIndex);
					var flights = this._flightsByLocationCode[route.getFromLocation().getCode()][route.getToLocation().getCode()];
					if (routeIndex === 0) {
						for (var flightIndex = 0; flightIndex < flights.length; flightIndex++) {
							var flight = flights[flightIndex];
							routeChainCombos.push([flight]);
						}
					} else {
						var newRouteChainCombos = [];
						for (var chainComboIndex = 0; chainComboIndex < routeChainCombos.length; chainComboIndex++) {
							var combo = routeChainCombos[chainComboIndex];
							for (var flightIndex = 0; flightIndex < flights.length; flightIndex++) {
								var flight = flights[flightIndex];
								if (flight.getDepartureTime() > combo[combo.length - 1].getArrivalTime()) {
									var newCombo = combo.slice();
									newCombo.push(flight);
									newRouteChainCombos.push(newCombo);
								}
							}
						}
						routeChainCombos = newRouteChainCombos;
					}
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

		TripsService.prototype.getTrips = function(tripQuery) {

			var forwardFlightChains = this._flightMap.buildFlightChanes(tripQuery.GetForwardRouteQuery());

			forwardFlightChains = forwardFlightChains.filter(function(route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			});

			var trips = [];

			if (tripQuery.GetBackRouteQuery()) {
				var backFlightChains = this._flightMap.buildFlightChanes(tripQuery.GetBackRouteQuery());

				backFlightChains = backFlightChains.filter(function(route) {
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
				trips = forwardFlightChains.map(function(route) {
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