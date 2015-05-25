var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Airline = new Schema({
	"_id": Schema.ObjectId,
	"airlineId": Number,
	"name": String,
	"alias": String,
	"iata": String,
	"icao": String,
	"callsign": String,
	"country": String,
	"active": String
});

module.exports = mongoose.model('Airline', Airline);