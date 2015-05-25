var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Airport = new Schema({
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
});

module.exports = mongoose.model('Airport', Airport);