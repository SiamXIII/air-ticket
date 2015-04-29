/// <reference path="typings/tsd.d.ts" />
import express = require('express');
import url = require("url");

import AirTicketServerInterface = require("./custom_modules/air-ticket-server-interface/AirTicketServerInterface");
import TicketsStore = require("./TicketsStore");
import QueryMapper = require("./TicketQueryMapper");

var app = express();

app.get('/',(req, res) => {
	res.send('Hello World!');
});

app.get('/api/0.1.0/tickets',(incomingMessage, serverResponse) => {


	serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");

	//serverResponse.json(new TicketsStore.MongoTicketsDb().getTickets(
	//	QueryMapper.map(AirTicketServerInterface.TicketQuery.parseFromUrlQueryArg(
	//		url.parse(incomingMessage.url).query))));

	var tickets = new TicketsStore.MongoTicketsDb().getAllTickets(function (data) {
		serverResponse.json(data);

		serverResponse.end();
	});
});

var server = app.listen(3000,() => {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});