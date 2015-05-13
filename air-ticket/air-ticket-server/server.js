var express = require('express');

var AirTicket_Domain_Entities = require('./domain/Entities.js');
var AirTicket_Domain_Entities_DtoConverters = require('./domain/Entities_DtoConverters.js');
var AirTicket_Domain_Services = require('./domain/Services.js');
var AirTicket_Domain_Queries = require("./domain/Queries.js");
var AirTicket_Domain_Queries_DtoConverters = require("./domain/Queries_DtoConverters.js");

var flightsStore = require("./ticketsStore")();

var allLocations;
var allCities;
var flightMap;
var tripsService;

flightsStore.getAllLocations(function(data) {
    allLocations = data;
});

flightsStore.getAllCities(function(data) {
	allCities = data;
});

flightsStore.getAllFlights(function (data) {
    flightMap = new AirTicket_Domain_Services.FlightMap(data);
	tripsService = new AirTicket_Domain_Services.TripsService(flightMap);
});



var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api/cityCodes', function (incomingMessage, serverResponse) {
    serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");

    serverResponse.json(allCities);
	serverResponse.end();
});

app.get('/api/locations', function(incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");

	var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();

	serverResponse.json(
		allLocations.map(function (location) {
			return locationDtoConverter.convertToDto(location);
		}));

	serverResponse.end();
});

app.get('/api/cities', function (incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
	
	flightsStore.getAllCities(function (data) {
		serverResponse.json(data);
		serverResponse.end();
	});
});

app.options('/api/trips', function(incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
    serverResponse.setHeader('Access-Control-Allow-Headers', "Content-Type");
	serverResponse.end();
});

app.post('/api/trips', function(incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");

	var tripDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();

	var body = "";

	incomingMessage.on("data", function(data) {
		body += data;
	});

	incomingMessage.on("end", function() {
        var tripQueryDto = JSON.parse(body);

		var tripQuery = new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertFromDto(tripQueryDto);

		serverResponse.json(tripsService.getTrips(tripQuery)
			.map(function(trip) {
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