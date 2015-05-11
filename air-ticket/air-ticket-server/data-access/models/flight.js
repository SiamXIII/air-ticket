var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schemas
var Flight = new Schema({
	'_from': {
		type: Schema.ObjectId,
		ref: 'Location'
	},
	'_to': {
		type: Schema.ObjectId,
		ref: 'Location'
	},
	'departureTime': Date,
	'arrivalTime': Date,
	'vendor': String,
	'price': Number,
	'flightCode': String
});

module.exports = mongoose.model('Flight', Flight);