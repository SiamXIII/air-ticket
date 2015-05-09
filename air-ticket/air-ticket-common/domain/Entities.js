var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
        function Location(code) {
            this._code = code;
        }
        Object.defineProperty(Location.prototype, "code", {
            get: function () {
                return this._code;
            },
            enumerable: true,
            configurable: true
        });
        return Location;
    })();
	AirTicket_Domain_Entities.Location = Location;

    var Flight = (function () {
        function Flight(from, to) {
            this._from = from;
            this._to = to;
        }
        Object.defineProperty(Flight.prototype, "from", {
            get: function () {
                return this._from;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Flight.prototype, "to", {
            get: function () {
                return this._to;
            },
            enumerable: true,
            configurable: true
        });
        return Flight;
    })();
    AirTicket_Domain_Entities.Flight = Flight;

    var Route = (function () {
        function Route(flights) {
            this._flights = flights;
        }
        Object.defineProperty(Route.prototype, "flightsCount", {
            get: function () {
                return this._flights.length;
            },
            enumerable: true,
            configurable: true
        });
        Route.prototype.getFlignt = function (flightIndex) {
            return this._flights[flightIndex];
        };
        Object.defineProperty(Route.prototype, "from", {
            get: function () {
                return this._flights[0].from;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Route.prototype, "to", {
            get: function () {
                var lastFlightIndex = this._flights.length - 1;
                return this._flights[lastFlightIndex].to;
            },
            enumerable: true,
            configurable: true
        });
        return Route;
    })();
    AirTicket_Domain_Entities.Route = Route;

    var FlightMap = (function () {
        function FlightMap(flights) {
            this._flights = flights;
        }

        Object.defineProperty(FlightMap.prototype, "flights", {
            get: function () {
                return this._flights;
            },
            enumerable: true,
            configurable: true
        });

        FlightMap.prototype.getFlightsFrom = function (locationCode) {
            var resultFlights = [];
            for (var i = 0; i < this.flights.length; i++) {
                var flight = this.flights[i];
                if (flight.from.code === locationCode) {
                    resultFlights.push(flight);
                }
            }
            return resultFlights;
        };

        FlightMap.prototype.getFlightsTo = function (locationCode) {
            var resultFlights = [];
            for (var i = 0; i < this.flights.length; i++) {
                var flight = this.flights[i];
                if (flight.to.code === locationCode) {
                    resultFlights.push(flight);
                }
            }
            return resultFlights;
        };

        FlightMap.prototype.checkRoute = function (route, query) {
        	if (route.from.code === query.fromLocationCode && route.to.code === query.toLocationCode) {
                return {
                    requiredRoute: true,
                    stopSearching: false,
                    continueSearching: false
                };
            }
            if (route.flightsCount > 5) {
                return {
                    requiredRoute: false,
                    stopSearching: true,
                    continueSearching: false
                };
            }
            return {
                requiredRoute: false,
                stopSearching: false,
                continueSearching: true
            };
        };

        FlightMap.prototype.createNewRoute = function (route, additionalFlight) {
            var flightsArray = [];
            for (var i = 0; i < route.flightsCount; i++) {
                flightsArray.push(route.getFlignt(i));
            }
            flightsArray.push(additionalFlight);
            return new Route(flightsArray);
        };

        FlightMap.prototype.getRoutes = function (query) {
            var routeStack = new Array();
            var fromFlights = this.getFlightsFrom(query.fromLocationCode);
            while (fromFlights.length > 0) {
                routeStack.push(new Route([fromFlights.shift()]));
            }
            var resultRoutes = [];
            while (routeStack.length > 0) {
                var route = routeStack.pop();
                var routeCheckResult = this.checkRoute(route, query);
                if (routeCheckResult.requiredRoute) {
                    resultRoutes.push(route);
                }
                else if (routeCheckResult.stopSearching) {
                    continue;
                }
                else if (routeCheckResult.continueSearching) {
                    var nextFlights = this.getFlightsFrom(route.to.code);
                    while (nextFlights.length > 0) {
                        routeStack.push(this.createNewRoute(route, nextFlights.shift()));
                    }
                }
                else {
                    throw "Unknown routeCheckResult";
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
        return Trip;
    })();
    AirTicket_Domain_Entities.Trip = Trip;

    var TripsService = (function () {
    	function TripsService(flightMap) {
    		this._flightMap= flightMap;
    	}

    	TripsService.prototype.getTrips = function(query) {
		    var routes = this._flightMap.getRoutes(query);

		    return routes.map(function(route) {
			    return new Trip(route);
		    });
	    }

	    return TripsService;
    })();
    AirTicket_Domain_Entities.TripsService = TripsService;

})(AirTicket_Domain_Entities || (AirTicket_Domain_Entities = {}));

if (module && module.exports) {
	module.exports = AirTicket_Domain_Entities;
}