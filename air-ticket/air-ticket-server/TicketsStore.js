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
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("Hogwards"), new Date(2015, 10, 10, 5, 30), new Date(2015, 10, 10, 10, 30)),
	new Entities.Flight(new Entities.Location("Minsk"), new Entities.Location("London") , new Date(2015, 10, 10, 3, 30), new Date(2015, 10, 10, 7, 00)),
	new Entities.Flight(new Entities.Location("London"), new Entities.Location("Hogwards"), new Date(2015, 10, 10, 7, 30), new Date(2015, 10, 10, 10, 00)),
	new Entities.Flight(new Entities.Location("Hogwards"), new Entities.Location("Piter"), new Date(2015, 10, 15, 12, 30), new Date(2015, 10, 15, 17, 00)),
	new Entities.Flight(new Entities.Location("Piter"), new Entities.Location("Minsk"), new Date(2015, 10, 15, 17, 50), new Date(2015, 10, 15, 21, 00))
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