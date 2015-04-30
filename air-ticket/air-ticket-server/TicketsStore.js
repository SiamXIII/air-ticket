var flightsDataAccess = require('./data-access/data-access.js').Flights;

var instance = {
	getAllTickets : function (callback) {
		flightsDataAccess.find({}, function (err, data) {
			callback(data);
		});
	},
	getTickets : function (ticketQuery) {
		return [
			{
				id: 1
			},
			{
				id: 2
			},
			{
				id: 3
			}
		];
	},
	getPlaces: function (callback) {
		var places = {};
		var sent = false;
		
		flightsDataAccess.find().distinct('from', function (err, data) {
			places.departure = data;
			
			if (!sent && places.arrival) {
				callback(places);
				sent = true;
			}
		});
		
		flightsDataAccess.find().distinct('to', function (err, data) {
			places.arrival = data;
			
			if (!sent && places.departure) {
				callback(places);
				sent = true;
			}
		});
	}
};

module.exports = function () {
	return instance;
}