var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Flight = new Schema({
	'from': {
		type: Schema.Types.ObjectId,
		ref: 'Location'
	},
	'to': {
		type: Schema.Types.ObjectId,
		ref: 'Location'
	},
	'departureTime': Date,
	'arrivalTime': Date,
	'vendor': String,
	'price': Number,
	'flightCode': String
});