var routesDataAccess = require('./data-access/data-access.js').Routes;
var locationsDataAccess = require('./data-access/data-access.js').Airports;
var Entities = require('./domain/Entities.js');

var instance = {
    getAllLocations: function (callback) {
        locationsDataAccess.find()
			.lean(true)
			.exec(function (err, data) {
            var locations = [];
            
            data.forEach(function (location) {
	            locations.push(new Entities.Location(location.iata,
		            location.name + ', ' + location.city + ', ' + location.country,
		            location.timezone * 60));
            });
            
            callback(locations);
        });
    },
    
    getAllCities: function (callback) {
        instance.getAllLocations(function (data) {
            var allCities = data.map(function (location) { return location.getCityCode() })
				.sort()
				.filter(function (city, index, arr) {
                return index === 0 ||
						city !== arr[index - 1];
            });
            
            callback(allCities);
        });
    },
    
    //getAllRoutes: function (callback) {
    //	routesDataAccess.find()
    //		.populate('_from')
    //		.populate('_to')
    //		.lean(true)
    //		.exec(function (err, data) {
    //		var flights = [];
    
    //		////TODO: Location coordinates.
    //		data.forEach(function (flight) {
    //			flights.push(new Entities.Flight(
    //				new Entities.Route(
    //					new Entities.Location(flight.sourceAirport.iata, flight.sourceAirport.name, flight.sourceAirport.timezone * 60, 0, 0),
    //                        new Entities.Location(flight.destinationAirport.iata, flight.destinationAirport.name, flight.destinationAirport.timezone * 60, 0, 0)),
    //				new Date(), new Date(), flight.airline.name, 100));
    //		});
    
    //		callback(flights);
    //	});
    //},
    
    getAllRoutes: function (callback) {
        routesDataAccess.find({})
		.limit(100)
		.lean(true)
		.exec(function (err, data) {
            if (!err) {
                var airlinesResult = [];
                
                
                data.forEach(function (route) {
                    var airlines = route.airlines;
                    var routeDomain = new Entities.Route(
                        new Entities.Location(route.from.iata, route.from.name,
							route.from.timezone * 60, route.from.latitude,
							route.from.longtitude),
						new Entities.Location(route.to.iata, route.to.name,
							route.to.timezone * 60, route.to.latitude,
							route.to.longtitude));
                    
                    route.airlines.forEach(function (airline) {
                        var airlineDomain = new Entities.Airline(airline.name + " " + airline.airlineId, airline.name, routeDomain);
                        
                        airlinesResult.push(airlineDomain);
                    });
                });
                
                
                callback(airlinesResult);
            }
        });
    },
    
    getAllCities: function (callback) {
        locationsDataAccess.find()
			.distinct('city')
			.exec(function (err, data) {
            callback(data);
        });
    }
}

module.exports = function () {
    return instance;
}