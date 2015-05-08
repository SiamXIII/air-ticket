var express = require('express');
var ticketsStore = require("./ticketsStore");
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/api/0.1.0/tickets', function (incomingMessage, serverResponse) {
    serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
    
    ticketsStore().getAllTickets(function (data) {
        serverResponse.json(data);
        serverResponse.end();
    });
});
app.get('/api/0.1.0/places', function (incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");

	ticketsStore().getPlaces(function (data) {
		serverResponse.json(data);
		serverResponse.end();
	});
});
app.get('/api/0.1.0/search-trip', function (incomingMessage, serverResponse) {
	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
	
	ticketsStore().searchTrips(incomingMessage.query, function (data) {
		serverResponse.json(data);
		serverResponse.end();
    });
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});