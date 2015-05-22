var express = require('express');

var AirTicket_Domain_Entities = require('./domain/Entities.js');
var AirTicket_Domain_Entities_DtoConverters = require('./domain/Entities_DtoConverters.js');
var AirTicket_Domain_Services = require('./domain/Services.js');
var AirTicket_Domain_Queries = require("./domain/Queries.js");
var AirTicket_Domain_Queries_DtoConverters = require("./domain/Queries_DtoConverters.js");

var flightsStore = require("./ticketsStore")();

var LineByLineReader = require('line-by-line');

var allLocations = [];
var routes = [];
var flightMap;
var tripsService;

var airReader = new LineByLineReader('filesData/airports.dat');

airReader.on('line', function (line) {
	var location = line.replace(/"/g, '').split(',');
	var loc = new AirTicket_Domain_Entities.Location("CODE" + location[0], location[1], location[9], location[6], location[7]);
	allLocations.push(loc);
	allLocations["CODE" + location[0]] = loc;
});

airReader.on('end', function () {
	var routeReader = new LineByLineReader('filesData/routes.dat');
	routeReader.on('line', function (line) {
		var route = line.replace(/"/g, '').split(',');
		
		var from = allLocations["CODE" + route[3]];
		var to = allLocations["CODE" + route[5]];
		
		if (from && to) {
			routes.push(new AirTicket_Domain_Entities.Route(from, to));
		}
	});
	
	routeReader.on('end', function (line) {
		var rm = new AirTicket_Domain_Services.RouteMap(routes);
		
		var fg = new AirTicket_Domain_Services.FlightGenerator();
		var flights = fg.generate(2, routes);
		var fm = new AirTicket_Domain_Services.FlightMap(flights, rm);
		
		flightMap = fm;
		
		tripsService = new AirTicket_Domain_Services.TripsService(flightMap);
	});
});



//flightsStore.getAllLocations(function (data) {
//	//allLocations = data;
//});

//flightsStore.getAllFlights(function (data) {

//});

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
	var message = incomingMessage.query.q;
	
	var locationDtoConverter = new AirTicket_Domain_Entities_DtoConverters.LocationDtoConverter();
	serverResponse.json(function () {
		if (message) {
			var locations = allLocations.map(function (location) {
				return locationDtoConverter.convertToDto(location);
			}).filter(function (location) {
				if (location._code.indexOf(message) != -1) {
					return location;
				}
			}).splice(0, 20);
			
			return locations;
		} 
		else {
			return [];
		}
		
	}());
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


//var chanes = fm.buildFlightChanes(new AirTicket_Domain_Queries.FlightChainQuery(
//	new AirTicket_Domain_Queries.LocationQuery("Minsk"), new AirTicket_Domain_Queries.LocationQuery("Praga"), null, null));

//var a = 10;