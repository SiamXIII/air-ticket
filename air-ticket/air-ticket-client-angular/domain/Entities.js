var AirTicket_Domain_Entities;

(function (AirTicket_Domain_Entities) {

	var Location = (function () {
        function Location(code) {
            this._code = code;
        }
        
		Location.prototype.getCode = function() {
			return this._code;
		}

		return Location;
    })();
	AirTicket_Domain_Entities.Location = Location;

    var Flight = (function () {
        function Flight(from, to) {
            this._from = from;
            this._to = to;
        }
        
		Flight.prototype.getFromLocation = function() {
			return this._from;
		}

		Flight.prototype.getToLocation = function () {
			return this._to;
		}

	    return Flight;
    })();
    AirTicket_Domain_Entities.Flight = Flight;

    var Route = (function () {
        function Route(flights) {
            this._flights = flights;
        }
        
		Route.prototype.getFlightsCount = function() {
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

        FlightMap.prototype.getFlightsTo = function (locationCode) {
            var resultFlights = [];
            for (var i = 0; i < this.flights.length; i++) {
                var flight = this.flights[i];
                if (flight.getToLocation().getCode() === locationCode) {
                    resultFlights.push(flight);
                }
            }
            return resultFlights;
        };

        FlightMap.prototype.checkRoute = function (route, query) {
        	if (route.getFromLocation().getCode() === query.fromLocationCode && route.getToLocation().getCode() === query.toLocationCode) {
                return {
                    requiredRoute: true
                };
            }
            if (route.getFlightsCount() > 5) {
                return {
                    stopSearching: true
                };
            }
            return {
                continueSearching: true
            };
        };

        FlightMap.prototype.createNewRoute = function (route, additionalFlight) {
            var flightsArray = [];
            for (var i = 0; i < route.getFlightsCount(); i++) {
                flightsArray.push(route.getFlight(i));
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
                	var nextFlights = this.getFlightsFrom(route.getToLocation().getCode());
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

		Trip.prototype.getFromLocation = function() {
			return this._forwardRoute.getFromLocation();
		}

		Trip.prototype.getToLocation = function () {
			return this._forwardRoute.getToLocation();
		}

		Trip.prototype.getForwardRoute = function() {
			return this._forwardRoute;
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