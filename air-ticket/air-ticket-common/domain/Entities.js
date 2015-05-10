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
        function Flight(from, to, departureTime, arrivalTime) {
            this._from = from;
            this._to = to;

	        if (departureTime >= arrivalTime) {
		        throw new Error("Departure time must be less than arrival time.");
	        }

	        this._departureTime = departureTime;
	        this._arrivalTime = arrivalTime;
        }
        
		Flight.prototype.getFromLocation = function() {
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

	    Route.prototype.getDepartureTime = function () {
	    	return this.getFlight(0).getDepartureTime();
	    }

	    Route.prototype.getArrivalTime = function () {
		    return this.getFlight(this.getFlightsCount() - 1).getArrivalTime();
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

	    FlightMap.prototype.getNextFlights = function(route) {
		    var nextFlights = this.getFlightsFrom(route.getToLocation().getCode())
			    .filter(function(flight) {
				    return route.getFlightsCount() < 5 &&
					    flight.getDepartureTime() > route.getArrivalTime();
			    });

		    return nextFlights;
	    };

        FlightMap.prototype.createNewRoute = function (route, additionalFlight) {
            var flightsArray = [];
            for (var i = 0; i < route.getFlightsCount(); i++) {
                flightsArray.push(route.getFlight(i));
            }
            flightsArray.push(additionalFlight);
            return new Route(flightsArray);
        };

	    FlightMap.prototype.getRoutes = function(query) {
		    var routeStack = new Array();
		    var fromFlights = this.getFlightsFrom(query.fromLocationCode);
		    while (fromFlights.length > 0) {
			    routeStack.push(new Route([fromFlights.shift()]));
		    }
		    var resultRoutes = [];
		    while (routeStack.length > 0) {
			    var route = routeStack.pop();
			    if (route.getFromLocation().getCode() === query.fromLocationCode && route.getToLocation().getCode() === query.toLocationCode) {
				    resultRoutes.push(route);
			    } else {
				    var nextFlights = this.getNextFlights(route);
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