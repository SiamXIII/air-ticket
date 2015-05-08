var flightsDataAccess = require('./data-access/data-access.js').Flights;
var locationsDataAccess = require('./data-access/data-access.js').Locations;

var Flight = require('./domain-models/flight.js').Flight;
var Location = require('./domain-models/location.js').Location;

var FlightMap = function () {
	flightsDataAccess.find({})
	.populate('from')
	.populate('to')
	.lean(true)
	.exec(function (err, data) {
		this.flights = data;
	});
}

module.exports = FlightMap;