var mongoose = require('mongoose');
var config = require('../config/config.js');

var Airport = require('./models/airport.js');
var Airline = require('./models/airline.js');
var Route = require('./models/route.js');

mongoose.connect(config.get('mongoose:uri'));

var db = mongoose.connection;

module.exports.Airports = mongoose.model('Airport', Airport);
module.exports.Airlines = mongoose.model('Airline', Airline);
module.exports.Routes = mongoose.model('Route', Route);
