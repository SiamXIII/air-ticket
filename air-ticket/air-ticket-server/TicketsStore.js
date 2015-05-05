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
			places.departure = data.sort();
			
			if (!sent && places.arrival) {
				callback(places);
				sent = true;
			}
		});
		
		flightsDataAccess.find().distinct('to', function (err, data) {
			places.arrival = data.sort();
			
			if (!sent && places.departure) {
				callback(places);
				sent = true;
			}
		});
	},
	searchTrips: function (query, callback) {
		var params = JSON.parse(query.params);
		if (!params.twoway) {
			var trip = buildFindQuery(JSON.parse(query.search));
			flightsDataAccess.find(trip, function (err, data) {
				callback(data);
			});
		}
		else {
			var trips = {};
			var forwardTrips;
			var comebackTrips;
			var sent = false;
			
			flightsDataAccess.find(buildFindQuery(JSON.parse(query.search)), function (err, data) {
				forwardTrips = data;
				if (!sent && comebackTrips) {
					callback(createTwoWayTrips(forwardTrips, comebackTrips));
					sent = true;
				}
			}).lean(true);
			
			
			flightsDataAccess.find(buildComebackFindQuery(JSON.parse(query.search)), function (err, data) {
				comebackTrips = data;
				if (!sent && forwardTrips) {
					callback(createTwoWayTrips(forwardTrips, comebackTrips));
					sent = true;
				}
			}).lean(true);
		}
	}
};

function createTwoWayTrips(forwardTrips, backTrips) {
	var trips = [];
	
	forwardTrips.forEach(function (forwardTrip) {
		backTrips.forEach(function (backTrip) {
			trips.push({
				forwardTrip: forwardTrip, 
				backTrip: backTrip
			});
		});
	});
	
	return trips;
}

function buildFindQuery(query) {
	var searchDate = new Date(query.departureDate);
	var nextDay = new Date();
	nextDay.setDate(searchDate.getDate() + 1);
	
	return {
		from: query.from,
		to: query.to,
		departureDate: { "$gte": searchDate, "$lt": nextDay }
	}
}

function buildComebackFindQuery(query) {
	return buildFindQuery({
		from: query.to,
		to: query.from,
		departureDate: query.comebackDate
	});
}

module.exports = function () {
	return instance;
}