﻿ var FlightsMap = (function () {
    function FlightsMap(flights) {
        this.flights = flights;
    }

    FlightsMap.prototype.getFlightsFrom = function (placeCode) {
        var resultFlights = [];
        for (var i = 0; i < this.flights.length; i++) {
            var flight = this.flights[i];
            if (flight.from.code === placeCode) {
                resultFlights.push(flight);
            }
        }
        return resultFlights;
    };

    FlightsMap.prototype.getFlightsTo = function (placeCode) {
        var resultFlights = [];
        for (var i = 0; i < this.flights.length; i++) {
            var flight = this.flights[i];
            if (flight.to.code === placeCode) {
                resultFlights.push(flight);
            }
        }
        return resultFlights;
    };

    FlightsMap.prototype.checkRoute = function (route, query) {
        if (route.length > 5) {
            return {
                stopSearching: true
            };
        }
        if (route[0].from.code === query.fromCode && route[route.length - 1].to.code === query.toCode) {
            return {
                requiredRoute: true
            };
        }
        return {
            continueSearching: true
        };
    };

    FlightsMap.prototype.getRoutes = function (query) {
        var routeStack = [];
        var fromFlights = this.getFlightsFrom(query.fromCode);
        while (fromFlights.length > 0) {
            routeStack.push([fromFlights.shift()]);
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
                var nextFlights = this.getFlightsFrom(route[route.length - 1].to.code);
                while (nextFlights.length > 0) {
                    var newRoute = route.slice(0); // clone
                    newRoute.push(nextFlights.shift());
                    routeStack.push(newRoute);
                }
            }
            else {
                throw "Unknown routeCheckResult";
            }
        }
        return resultRoutes;
    };

    return FlightsMap;
})();
module.exports = FlightsMap;
