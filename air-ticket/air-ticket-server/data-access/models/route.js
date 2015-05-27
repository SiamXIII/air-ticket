var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Route = new Schema({
	"airlines": [{
			"_id": Schema.ObjectId,
			"airlineId": Number,
			"name": String,
			"alias": String,
			"iata": String,
			"icao": String,
			"callsign": String,
			"country": String,
			"active": String
		}],
	"from": {
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
	"to": {
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
	}
});

module.exports = mongoose.model('Route', Route);