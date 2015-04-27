var mongoose = require('mongoose');
var config = require('../config/config.js');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

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
	'departure-time': {
		type: Date,
	},
	'arrival-time': {
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
	}
});

module.exports.Flights = mongoose.model('Flight', Flight);