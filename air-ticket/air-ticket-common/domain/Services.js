var AirTicket_Domain_Entities;

if (!AirTicket_Domain_Entities) {
	AirTicket_Domain_Entities = require("./Entities.js");
}

var AirTicket_Domain_Services;

(function (AirTicket_Domain_Services) {
	var RouteMap = (function () {

		function RouteMap(routes) {
			this._routesByLocationCode = {};
			this._locations = {};

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

		RouteMap.prototype.getLocations = function() {
			return this._locations;
		};

		RouteMap.prototype.buildRouteChains = function (from, to) {
			var resultChains = [];

			var stack = [{ location: from, routeIndex: 0 }];

			while (stack.length > 0) {

				var topItem = stack[stack.length - 1];

				var canAdd = stack.length < 5 &&
					this._routesByLocationCode[topItem.location].length > topItem.routeIndex;

				if (canAdd) {
					var addedL = this._routesByLocationCode[topItem.location][topItem.routeIndex].getToLocation().getCode();

					stack[stack.length - 1].routeIndex++;
					stack.push({ location: addedL, routeIndex: 0});
					continue;
				}

				var goodChain = topItem.location === to;

				if (goodChain) {
					var chain = [];
					for (var i = 1; i < stack.length; i++) {
						chain.push(this._routesByLocationCode[stack[i - 1].location][stack[i].location]);
					}

					resultChains.push(chain);
				}

				stack.pop();

			}

			return resultChains;

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
			var routeChains = this._routeMap.buildRouteChains(flightChainQuery.getFromQuery().getCode(), flightChainQuery.getToQuery().getCode());
			var flightsForChanes = [];
			for (var routeChangeIndex = 0; routeChangeIndex < routeChains.length; routeChangeIndex++) {
				var routeChain = routeChains[routeChangeIndex];
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

			var forwardRoutes = this._flightMap.getRoutes(tripQuery.GetForwardRouteQuery());

			forwardRoutes.filter(function(route) {
				var result = route.getMaxTransferDuration() < tripQuery.getMaxTransferDuration();

				return result;
			});

			if (tripQuery.GetBackRouteQuery()) {
				var backRoutes = this._flightMap.getRoutes(tripQuery.GetBackRouteQuery());

				backRoutes.filter(function(route) {
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

		FlightGenerator.prototype.generate = function(load, routes) {
			var routeMap = new AirTicket_Domain_Services.RouteMap(routes);
			var locations = routeMap.getLocations();
			var flights = [];

			for (var index = 0; i < routes.length; index++) {
				var route = routes[index];
				for (var i = 0; i < load; i++) {
					flights.push(new AirTicket_Domain_Entities.Flight(route, new Date(), "SOMECODE", "Aeroflot", 100));
				}
			}

			for (var i = 0; i < locations.length; i++) {
				var location1 = locations[i];
				for (var j = 0; j < locations.length; j++) {
					var location2 = locations[j];


		}
			}
		}

		return FlightGenerator;
	})();
	AirTicket_Domain_Services.FlightGenerator = FlightGenerator;

})(AirTicket_Domain_Services || (AirTicket_Domain_Services = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Services;
}