var express = require('express');

var AirTicket_Domain_Entities = require('./domain/Entities.js');
var AirTicket_Domain_Entities_DtoConverters = require('./domain/Entities_DtoConverters.js');
var AirTicket_Domain_Services = require('./domain/Services.js');
var AirTicket_Domain_Queries = require("./domain/Queries.js");
var AirTicket_Domain_Queries_DtoConverters = require("./domain/Queries_DtoConverters.js");

var flightsStore = require("./ticketsStore")();

var LineByLineReader = require('line-by-line');


var routes = [];
var flightMap;
var tripsService;
var allLocations;

(function init() {
	flightsStore.getAllLocations(function (locations) { 
		allLocations = locations;
	});

	flightsStore.getAllRoutes(function (routes) {
		var rm = new AirTicket_Domain_Services.RouteMap(routes);
		var fg = new AirTicket_Domain_Services.FlightGenerator();
		var flights = fg.generate(2, routes);
		var fm = new AirTicket_Domain_Services.FlightMap(flights, rm);
		
		flightMap = fm;
		
		tripsService = new AirTicket_Domain_Services.TripsService(flightMap);
	});
})();

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
				if (location.getFullName().indexOf(message) != -1) {
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
	
	console.log("get trips request.");
	
	var tripDtoConverter = new AirTicket_Domain_Entities_DtoConverters.TripDtoConverter();
	
	var body = "";
	
	incomingMessage.on("data", function (data) {
		body += data;
	});
	
	incomingMessage.on("end", function () {
		
		console.log("request.");
		
		var tripQueryDto = JSON.parse(body);
		
		var tripQuery = new AirTicket_Domain_Queries_DtoConverters.TripQueryDtoConverter().convertFromDto(tripQueryDto);
		
		var date = new Date();
		console.log("search start.");
		
		var trips = tripsService.getTrips(tripQuery);
		
		console.log("search end." + (new Date() - date).toString());
		
		serverResponse.json(trips
			.map(function (trip) {
			return tripDtoConverter.convertToDto(trip);
		}));
		
		serverResponse.end();
		
		console.log("sended.");
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});