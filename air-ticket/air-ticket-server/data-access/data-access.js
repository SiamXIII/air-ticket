var mongoose = require('mongoose');
var config = require('../config/config.js');

var Location = require('./models/location.js');
var Flight = require('./models/flight.js');
var Airport = require('./models/airport.js');
var Airline = require('./models/airline.js');
var Route= require('./models/route.js');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

module.exports.Locations = mongoose.model('Location', Location);
module.exports.Flights = mongoose.model('Flight', Flight);
module.exports.Airports = mongoose.model('Airport', Airport);
module.exports.Airlines = mongoose.model('Airline', Airline);
module.exports.Routes = mongoose.model('Route', Route);