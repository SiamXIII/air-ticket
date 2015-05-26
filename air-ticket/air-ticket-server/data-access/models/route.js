var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Route = new Schema({
	"airline": {
		"_id": Schema.ObjectId,
		"airlineId": Number,
		"name": String,
		"alias": String,
		"iata": String,
		"icao": String,
		"callsign": String,
		"country": String,
		"active": String
	},
	"sourceAirport": {
		"_id": Schema.ObjectId,
		"airportId": Number,
		"name": String,
		"city": String,
		"country": String,
		"iata": String,
		"icao": String,
		"latitude": Number,
		"longtitude": Number,
		"altitude": Number,
		"timezone": Number,
		"dst": String,
		"tz": String
	},
	"destinationAirport": {
		"_id": Schema.ObjectId,
		"airportId": Number,
		"name": String,
		"city": String,
		"country": String,
		"iata": String,
		"icao": String,
		"latitude": Number,
		"longtitude": Number,
		"altitude": Number,
		"timezone": Number,
		"dst": String,
		"tz": String
	},
	"codeshare": String,
	"stops": String,
	"equipment": String
});

module.exports = mongoose.model('Route', Route);