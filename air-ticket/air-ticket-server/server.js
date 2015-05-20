var express = require('express');

var AirTicket_Domain_Entities = require('./domain/Entities.js');
var AirTicket_Domain_Entities_DtoConverters = require('./domain/Entities_DtoConverters.js');
var AirTicket_Domain_Services = require('./domain/Services.js');
var AirTicket_Domain_Queries = require("./domain/Queries.js");
var AirTicket_Domain_Queries_DtoConverters = require("./domain/Queries_DtoConverters.js");

var flightsStore = require("./ticketsStore")();

var allLocations;
var flightMap;
var tripsService;

flightsStore.getAllLocations(function (data) {
    allLocations = data;
});

flightsStore.getAllFlights(function (data) {
    flightMap = new AirTicket_Domain_Services.FlightMap(data);
    tripsService = new AirTicket_Domain_Services.TripsService(flightMap);
});

var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.use("*", function (incomingMessage, serverResponse, next) {
    serverResponse.setHeader('Access-Control-Allow-Origin', "*");
    serverResponse.setHeader('Access-Control-Allow-Headers', "Content-Type");
    serverResponse.setHeader('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
    next();
});

app.get('/api/locations', function (incomingMessage, serverResponse) {
    var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
    serverResponse.json(
        allLocations.map(function (location) {
            return locationDtoConverter.convertToDto(location);
        }));
    serverResponse.end();
});

app.post('/api/trips', function (incomingMessage, serverResponse) {
    var tripDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();
    
    var body = "";
    
    incomingMessage.on("data", function (data) {
        body += data;
    });
    
    incomingMessage.on("end", function () {
        var tripQueryDto = JSON.parse(body);
        
        var tripQuery = new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertFromDto(tripQueryDto);
        
        serverResponse.json(tripsService.getTrips(tripQuery)
			.map(function (trip) {
            return tripDtoConverter.convertToDto(trip);
        }));
        
        serverResponse.end();
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


var minskMog = new AirTicket_Domain_Entities.Route(
	new AirTicket_Domain_Entities.Location("Minsk", "Minsk", 300),
	new AirTicket_Domain_Entities.Location("Mogilew", "Mogilew", 300));

var mogPr = new AirTicket_Domain_Entities.Route(
	new AirTicket_Domain_Entities.Location("Mogilew", "Mogilew", 300),
	new AirTicket_Domain_Entities.Location("Praga", "Praga", 300));

var prMinsk = new AirTicket_Domain_Entities.Route(
	new AirTicket_Domain_Entities.Location("Praga", "Praga", 300),
	new AirTicket_Domain_Entities.Location("Minsk", "Minsk", 300));

var routes = [minskMog, mogPr, prMinsk];

var rm = new AirTicket_Domain_Services.RouteMap(routes);

var fg = new AirTicket_Domain_Services.FlightGenerator();
var flights = fg.generate(3, routes);
var fm = new AirTicket_Domain_Services.FlightMap(flights, rm);

var chanes = fm.buildFlightChanes(new AirTicket_Domain_Queries.FlightChainQuery(
	new AirTicket_Domain_Queries.LocationQuery("Minsk"), new AirTicket_Domain_Queries.LocationQuery("Praga"), null, null));

var a = 10;