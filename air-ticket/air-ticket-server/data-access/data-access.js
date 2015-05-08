var mongoose = require('mongoose');
var config = require('../config/config.js');

var Location = require('./models/location.js');
var Flight = require('./models/flight.js');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

module.exports.Locations = mongoose.model('Location', Location);
module.exports.Flights = mongoose.model('Flight', Flight);