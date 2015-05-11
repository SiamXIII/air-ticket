var express = require('express');

var flightsStore = require("./ticketsStore")();

var Entities = require('./domain/Entities');
var DtoConverters = require('./domain/Entities_DtoConverters');

var allLocations;
var flightMap;
var tripsService;

flightsStore.getAllLocations(function (data) {
	allLocations = data;
});

flightsStore.getAllFlights(function (data) {
	flightMap = new Entities.FlightMap(data);
	tripsService = new Entities.TripsService(flightMap);
});



var app = express();

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/api/locations', function (incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
	
	var locationDtoConverter = new DtoConverters.LocationDtoConverter();
	
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

app.post('/api/trips', function (incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
	
	var tripDtoConverter = new DtoConverters.TripDtoConverter();
	
	serverResponse.json(tripsService.getTrips(incomingMessage.query)
		.map(function (trip) {
		return tripDtoConverter.convertToDto(trip);
	}));
	
	serverResponse.end();
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});