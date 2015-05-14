var flightsDataAccess = require('./data-access/data-access.js').Flights;
var locationsDataAccess = require('./data-access/data-access.js').Locations;
var Entities = require('./domain/Entities.js');

var instance = {
	getAllLocations: function (callback) {
		locationsDataAccess.find()
			.lean(true)
			.exec(function(err, data) {
			var locations = [];
			
				data.forEach(function(location) {
					locations.push(new Entities.Location(location.code, location.fullName, "-0500"));
				});
			
			callback(locations);
			});
	},
    
    getAllCities: function(callback) {
		instance.getAllLocations(function(data) {
			var allCities = data.map(function(location) { return location.getCityCode() })
				.sort()
				.filter(function(city, index, arr) {
					return index === 0 ||
						city !== arr[index - 1];
				});

            callback(allCities);
		});
	},
	
	getAllFlights: function(callback) {
		flightsDataAccess.find()
			.populate('_from')
			.populate('_to')
			.lean(true)
			.exec(function (err, data) {
			var flights = [];
			
			data.forEach(function (flight) {
				flights.push(new Entities.Flight(
					new Entities.Location(flight._from.code, flight._from.fullName, flight._from.city), 
					new Entities.Location(flight._to.code, flight._to.fullName, flight._to.city), 
					flight.departureTime, flight.arrivalTime));
			})
			
			callback(flights);
		})
	},
	
	getAllCities: function (callback) {
		locationsDataAccess.find()
			.distinct('city')
			.exec(function (err, data) { 
			callback(data);
		})
	}
}

module.exports = function () {
	return instance;
}