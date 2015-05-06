var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Flight = new Schema({
	'from': {
		type: String,
		required: true
	},
	'to': {
		type: String,
		required: true
	},
	'departureDate': {
		type: Date,
	},
	'arrivalDate': {
		type: Date,
	},
	'vendor': {
		type: String,
	},
	'price': {
		type: Number,
	},
	'flight-id': {
		type: String,
	},
	'fromCode': String,
	'fromFull': String,
	'toCode': String,
	'toCode': String,
	'innerFlightsId': [Schema.ObjectId]
});