var mongoose = require('mongoose');
var config = require('../config/config.js');

var Flight = require('./models/flight.js');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

module.exports.Flights = mongoose.model('Flight', Flight);