var flightsDataAccess = require('./data-access/data-access.js').Flights;
var Entities = require('./domain/Entities.js');

var locations = [
	new Entities.Location("Minsk"),
	new Entities.Location("Mogilew"),
	new Entities.Location("Penza"),
	new Entities.Location("Praga"),
	new Entities.Location("Hogwards"),
	new Entities.Location("London")
];

var flights = [
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("Mogilew")),
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("Penza")),
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("Praga")),
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("Hogwards")),
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("London")),
	new Entities.Flight(new Entities.Location("London"), new Entities.Location("Hogwards"))
];

var instance = {
	getAllLocations: function(callback) {
		callback(locations);
	},

    getAllFlights: function(callback) {
	    callback(flights);
    }
}

module.exports = function () {
	return instance;
}