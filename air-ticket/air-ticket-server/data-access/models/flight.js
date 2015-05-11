var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Flight = new Schema({
	'from': {
		type: Schema.ObjectId,
		ref: 'Location'
	},
	'to': {
		type: Schema.ObjectId,
		ref: 'Location'
	},
	'departureTime': Date,
	'arrivalTime': Date,
	'vendor': String,
	'price': Number,
	'flightCode': String
});

