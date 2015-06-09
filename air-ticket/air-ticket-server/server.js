var util = require('util');
var express = require('express');
var port = process.env.port || 1337;

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


var app = express();

flightsStore.getAllAirLines(function (result) {
    
    console.log("Locations count: " + result.locations.length);
    console.log("Airlines count: " + result.airlines.length);
    console.log("Routes count: " + result.routes.length);
    console.log(util.inspect(process.memoryUsage()));

	allLocations = result.locations;

    var rm = new AirTicket_Domain_Services.RouteMap(result.routes);
    console.log("Routemap created.");
    console.log(util.inspect(process.memoryUsage()));
    
    var fg = new AirTicket_Domain_Services.FlightGenerator();
    var flights = [];
    var startDate = new Date(Date.UTC(2015, 4, 26));
    var endDate = new Date(Date.UTC(2015, 5, 1));
    for (var date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
        flights = flights.concat(fg.generate(1, result.airlines, date, new Date(date.valueOf() + 1000 * 60 * 60 * 24)));
    }

    console.log("Flights generated. Count: " + flights.length);
    console.log(util.inspect(process.memoryUsage()));
    
    var fm = new AirTicket_Domain_Services.FlightMap(flights, rm);
    console.log("Flightmap created.");
    console.log(util.inspect(process.memoryUsage()));
    
    flightMap = fm;
    
    tripsService = new AirTicket_Domain_Services.TripsService(flightMap);
    console.log("Trip service created.");
    console.log(util.inspect(process.memoryUsage()));
    
    
    /////////////////////////////////////
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
            var trips = tripsService.getTrips(tripQuery);
            
            serverResponse.json(trips
			.map(function (trip) {
                return tripDtoConverter.convertToDto(trip);
            }));
            
            serverResponse.end();
        });
    });
    
    var server = app.listen(port, function () {
        var host = server.address().address;
        console.log('Example app listening at http://%s:%s', host, port);
    });
});

